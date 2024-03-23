
;; title: cover
;; version: 0.1
;; summary: Manage covers
;; description: Create, update, stake tokens, vote and claim covers

;; NOTE use at-block to check covers instead of storing them in a map ?maybe?

;; traits
;;

;; token definitions
;;

;; constants
;;
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

;; data vars
;;

;; data maps
;;

;; u1 - Smart Contract Vulnerability
;; u2 - De-Peg Risk
(define-map covers (string-ascii 32) {
  amount: uint,
  type: uint,
  stakers: uint,
  ;; 1 - 100
  risk_factor: uint,
})

;; public functions
;;

(define-public (create_cover (name (string-ascii 32)) (cover_type uint))
  ;; (begin 
  ;; TODO Check not created
    (ok (map-set covers name {
      amount: u0,
      type: cover_type,
      stakers: u0,
      risk_factor: u10,
    }))
    ;; (ok true)
    ;; (ok (map-set names-map { name: "blockstack" } { id: 1337 }))
    ;; (ok (map-get? covers { name: new_name}))
  ;; )
)

(define-public (update_cover (name (string-ascii 32)) (amount uint)) 
  (begin
    (map-set covers name {
      amount: amount,
      type: (get type (unwrap! (map-get? covers name) (err u1234))),
      stakers: (get stakers (unwrap! (map-get? covers name) (err u1234))),
      risk_factor: u10,
    }) 
    (ok true)
  )
)

;; NOTE Tokens are MIN Type
(define-public (stake_tokens (cover_name (string-ascii 32)) (token_amount uint)) 
  (begin
    (unwrap! (contract-call? .token get-balance tx-sender) (err u1234))
    (map-set covers cover_name {
      amount: (+ token_amount (get amount (unwrap! (map-get? covers cover_name) (err u1234)))),
      type: (get type (unwrap! (map-get? covers cover_name) (err u1234))),
      stakers: (+ u1 (get stakers (unwrap! (map-get? covers cover_name) (err u1234)))),
      risk_factor: u10,
    }) 
    (ok true)
  )
)

;; vote
(define-public (vote_claim_validity (cover_name (string-ascii 32)))
  (ok true)
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
    (ok (map-get? covers "new_name"))
)

(define-read-only (get_cover_bought (name (string-ascii 32)))
    (ok
      (map-get? covers_bought {
        buyer: tx-sender,
        cover_name: name,
      }))
)



;; private functions
;;
;; TODO
(define-private (pay_claims) 
  (begin
    (ok true)  
  )
)


