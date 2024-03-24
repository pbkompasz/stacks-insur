;; title: cover
;; version: 0.2
;; summary: Manage covers
;; description: Create, update, stake tokens, vote and claim covers
;; todo: Add security

;; Owner
(define-constant contract-owner tx-sender)

;; Errors
(define-constant ERR_OWNER_ONLY (err u100))
(define-constant ERR_ALREADY_LOCKED (err u101))
(define-constant ERR_AMOUNT  (err u301))
(define-constant ERR_DAYS  (err u302))
(define-constant ERR_WRONG_COVER_TYPE (err u300))
(define-constant ERR_WRONG_VOTE_TYPE (err u301))
(define-constant ERR_COVER_EXISTS (err u100))
(define-constant ERR_NO_COVER (err u101))

;; Data
(define-map covers_bought
  {
    buyer: principal,
    cover_name: (string-ascii 32)
  } {
    amount: uint,
    duration_days: uint
  }
)

(define-map tokens_staked
  {
    staker: principal,
    cover_name: (string-ascii 32)
  } {
    amount: uint,
  }
)

;; (define-data-var covers_list (list 1 2) (list 1 2))



;; data vars
;;

;; data maps
;;

;; u1 - Smart Contract Vulnerability
;; u2 - De-Peg Risk
(define-map covers (string-ascii 32) {
  amount: uint,
  type: uint,
  stakers_cover: uint,
  stakers_risk: uint,
  ;; 1 - 100
  risk_factor: uint,
  start_vote: uint,
  yes_votes: uint,
})
;; public functions
;;

(define-public (create-cover (name (string-ascii 32)) (cover_type uint))
  ;; TODO Check not created
  (begin 
    (asserts! (or (is-eq cover_type u0) (is-eq cover_type u1)) ERR_WRONG_COVER_TYPE)
    (asserts! (is-none (map-get? covers name)) ERR_COVER_EXISTS)
    (ok (map-set covers name {
      amount: u0,
      type: cover_type,
      stakers_cover: u0,
      stakers_risk: u0,
      risk_factor: u10,
      start_vote: u0,
      yes_votes: u0,
    }))
  )
)

(define-public (update-cover (name (string-ascii 32)) (amount uint)) 
  (begin
    (asserts! (> amount u0) ERR_AMOUNT)
    (asserts! (not (is-none (map-get? covers name))) ERR_COVER_EXISTS)
    (map-set covers name {
      amount: amount,
      type: (get type (unwrap! (map-get? covers name) (err u1234))),
      stakers_cover: (get stakers_cover (unwrap! (map-get? covers name) (err u1234))),
      stakers_risk: (get stakers_risk (unwrap! (map-get? covers name) (err u1234))),
      risk_factor: u10,
      start_vote: u0,
      yes_votes: u0,
    }) 
    (ok true)
  )
)

;; NOTE Tokens are MIN Type
;; u0 - Risk, u1 - Cover
(define-public (stake-tokens (cover_name (string-ascii 32)) (token_amount uint) (stake_type uint)) 
  (begin
    (unwrap! (contract-call? .amm get-balance tx-sender) (err u1234))
    (asserts! (> token_amount u0) ERR_AMOUNT)
    (asserts! (not (is-none (map-get? covers cover_name))) ERR_NO_COVER)
    (map-set covers cover_name {
      amount: (+ token_amount (get amount (unwrap! (map-get? covers cover_name) (err u1234)))),
      type: (get type (unwrap! (map-get? covers cover_name) (err u1234))),
      stakers_cover: (+ u1 (get stakers_cover (unwrap! (map-get? covers cover_name) (err u1234)))),
      stakers_risk: (+ u1 (get stakers_risk (unwrap! (map-get? covers cover_name) (err u1234)))),
      risk_factor: u10,
      start_vote: u0,
      yes_votes: u0,
    }) 

    (map-set tokens_staked {
      staker: tx-sender,
      cover_name: cover_name,
    } {
      amount: token_amount
    }) 
    (try! (contract-call? .amm stake-adjust-deposit tx-sender token_amount))
    (ok true)
  )
)

;; vote
;; u1 - yes, u0 - no
(define-public (vote-claim (cover_name (string-ascii 32)) (vote uint))
  (begin
    (asserts! (or (is-eq vote u0) (is-eq vote u1)) ERR_WRONG_VOTE_TYPE)
    (unwrap! (map-get? tokens_staked {
      staker: tx-sender,
      cover_name: cover_name,
    }) (err u1234))
    (asserts! (> (get start_vote (unwrap! (map-get? covers cover_name) (err u1234)))
      (/ (get stakers_risk (unwrap! (map-get? covers cover_name) (err u1234))) u2)
    ) (err u12432))
     (map-set covers cover_name {
      amount: (get amount (unwrap! (map-get? covers cover_name) (err u1234))),
      type: (get type (unwrap! (map-get? covers cover_name) (err u1234))),
      stakers_risk: (+ u1 (get stakers_risk (unwrap! (map-get? covers cover_name) (err u1234)))),
      stakers_cover: (get stakers_cover (unwrap! (map-get? covers cover_name) (err u1234))),
      risk_factor: u10,
      start_vote: (get start_vote (unwrap! (map-get? covers cover_name) (err u1234))),
      yes_votes: (+ vote (get start_vote (unwrap! (map-get? covers cover_name) (err u1234)))),
    })
    (ok true)
  )
)

;; A vote to start a vote to start a vote ...
(define-public (vote-start-vote (cover_name (string-ascii 32)))
  (begin
    (asserts! (not (is-none (map-get? covers cover_name))) ERR_NO_COVER)
    (unwrap! (map-get? tokens_staked {
      staker: tx-sender,
      cover_name: cover_name,
    }) (err u1234))
    (map-set covers cover_name {
      amount: (get amount (unwrap! (map-get? covers cover_name) (err u1234))),
      type: (get type (unwrap! (map-get? covers cover_name) (err u1234))),
      stakers_risk: (get stakers_risk (unwrap! (map-get? covers cover_name) (err u1234))),
      stakers_cover: (get stakers_cover (unwrap! (map-get? covers cover_name) (err u1234))),
      risk_factor: (get risk_factor (unwrap! (map-get? covers cover_name) (err u1234))),
      start_vote: (+ u1 (get start_vote (unwrap! (map-get? covers cover_name) (err u1234)))),
      yes_votes: (get yes_votes (unwrap! (map-get? covers cover_name) (err u1234))),
    })
    (ok true)
  )
)



(define-public (get-cover-estimate (cover_name (string-ascii 32)) (amount uint))
  (ok (/ (* amount (get risk_factor (unwrap! (map-get? covers cover_name) (err u1234)))) u100))  
)

;; in STX
(define-public (buy-cover (cover_name (string-ascii 32)) (amount uint) (duration_days uint))
  (begin 
    (asserts! (> amount u0) ERR_AMOUNT)
    (asserts! (> duration_days u10) ERR_DAYS)
    (asserts! (not (is-none (map-get? covers cover_name))) ERR_NO_COVER)
    (let ((estimate (unwrap! (get-cover-estimate cover_name amount) (err u21432)))) 
      ;; TODO
      ;; (asserts! (> (unwrap! (contract-call? .token get-balance tx-sender) (err u1234)) amount) (err u432))
      (try! (stx-transfer? estimate tx-sender (as-contract tx-sender)))
    )
    (map-set covers_bought
      {
        buyer: tx-sender,
        cover_name: cover_name,
      } {
        amount: amount,
        duration_days: duration_days,
      }
    )
    (ok true)  
  )
)


;; read only functions
;;
(define-read-only (get-cover (name (string-ascii 32)))
    (ok (map-get? covers name))
)

(define-read-only (get-cover-bought (name (string-ascii 32)))
    (ok
      (map-get? covers_bought {
        buyer: tx-sender,
        cover_name: name,
      }))
)

(define-read-only (get-claims-active) (ok true))

;; private functions
;;
;; TODO
(define-private (payout-claims) 
  (begin
    (ok true)  
  )
)

(define-private (add-cover (cover_name (string-ascii 32)) (amount uint) (type uint) (stakers_cover uint) (stakers_risk uint) (risk_factor uint) (start_vote uint) (yes_votes uint)) 
  (map-insert covers cover_name { 
    amount: amount,
    type: type,
    stakers_cover: stakers_cover,
    stakers_risk: stakers_risk,
    risk_factor: risk_factor,
    start_vote: start_vote,
    yes_votes: yes_votes,
  }))

(add-cover "Uniswap V2" u0 u0 u0 u0 u10 u0 u0)
(add-cover "1inch" u0 u0 u0 u0 u10 u0 u0)
(add-cover "Yearn Finance" u0 u0 u0 u0 u10 u0 u0)
(add-cover "Aave v2" u0 u0 u0 u0 u10 u0 u0)
(add-cover "USDA - Arkadiko" u0 u1 u0 u0 u10 u0 u0)
(add-cover "UWU - UWU Protocol" u0 u1 u0 u0 u10 u0 u0)
(add-cover "DoC - Dollar on Chain" u0 u1 u0 u0 u10 u0 u0)
(add-cover "USDC" u0 u1 u0 u0 u0 u10 u0)
(add-cover "USDT - Tether USDt" u0 u1 u0 u0 u10 u0 u0)


;; For testing

(define-private (buy-cover-test (cover_name (string-ascii 32)) (amount uint) (duration_days uint)) 
  (begin 
    (let ((estimate (unwrap! (get-cover-estimate cover_name amount) (err u21432)))) 
      ;; TODO
      ;; (asserts! (> (unwrap! (contract-call? .token get-balance tx-sender) (err u1234)) amount) (err u432))
      ;; (ok estimate)
      (try! (stx-transfer? estimate tx-sender (as-contract tx-sender)))
    )
    (map-set covers_bought
      {
        buyer: 'ST2FJ1YXQ54HQZ3TXAXM1M1W6DJKQ338XT0T893FT,
        cover_name: cover_name,
      } {
        amount: amount,
        duration_days: duration_days,
      }
    )
    (ok true)  
  )
)
(buy-cover-test "Uniswap V2" u100000 u30)


