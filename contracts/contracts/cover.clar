;; title: cover
;; version: 0.1
;; summary: Manage covers
;; description: Create, update, stake tokens, vote and claim covers
;; todo: Add security

;; Owner
(define-constant contract-owner tx-sender)

;; Errors
(define-constant err-owner-only (err u100))
(define-constant err-already-locked (err u101))
(define-constant err-unlock-in-past (err u102))
(define-constant err-no-value (err u103))
(define-constant err-beneficiary-only (err u104))
(define-constant err-unlock-height-not-reached (err u105))

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

(define-public (create_cover (name (string-ascii 32)) (cover_type uint))
  ;; TODO Check not created
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

(define-public (update_cover (name (string-ascii 32)) (amount uint)) 
  (begin
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
(define-public (stake_tokens (cover_name (string-ascii 32)) (token_amount uint) (stake_type uint)) 
  (begin
    (unwrap! (contract-call? .amm get-balance tx-sender) (err u1234))
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
    (ok true)
  )
)

;; vote
;; u1 - yes, u0 - no
(define-public (vote_claim (cover_name (string-ascii 32)) (vote uint))
  (begin
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
(define-public (vote_start_vote (cover_name (string-ascii 32)))
  (begin
    (unwrap! (map-get? tokens_staked {
      staker: tx-sender,
      cover_name: cover_name,
    }) (err u1234))
    (map-set covers cover_name {
      amount: (get amount (unwrap! (map-get? covers cover_name) (err u1234))),
      type: (get type (unwrap! (map-get? covers cover_name) (err u1234))),
      stakers_risk: (get stakers_risk (unwrap! (map-get? covers cover_name) (err u1234))),
      stakers_cover: (get stakers_cover (unwrap! (map-get? covers cover_name) (err u1234))),
      risk_factor: u10,
      start_vote: (+ u1 (get start_vote (unwrap! (map-get? covers cover_name) (err u1234)))),
      yes_votes: u0,
    })
    (ok true)
  )
)



(define-public (get_cover_estimate (cover_name (string-ascii 32)) (amount uint))
  (ok (/ (* amount (get risk_factor (unwrap! (map-get? covers cover_name) (err u1234)))) u100))  
)

;; in STX
(define-public (buy_cover (cover_name (string-ascii 32)) (amount uint) (duration_days uint))
  (begin 
    (let ((estimate (unwrap! (get_cover_estimate cover_name amount) (err u21432)))) 
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
(define-read-only (get_cover (name (string-ascii 32)))
    (ok (map-get? covers name))
)

(define-read-only (get_cover_bought (name (string-ascii 32)))
    (ok
      (map-get? covers_bought {
        buyer: tx-sender,
        cover_name: name,
      }))
)

;; (define-read-only (get_claims_active) ())


;; private functions
;;
;; TODO
(define-private (payout_claims) 
  (begin
    (ok true)  
  )
)


