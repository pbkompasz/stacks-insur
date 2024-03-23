
;; title: Automated Market Maker
;; version: 0.1
;; summary: Deposit and redeem STX tokens
;; description: Automated Market Maker to provide liquidity for mint and redeem operations



;; traits
;;

;; token definitions
;;

;; constants
;;

(define-constant ERR_OWNER_ONLY  (err u100))
(define-constant ERR_REINIT  (err u101))
(define-constant ERR_AMOUNT  (err u102))
(define-constant ERR_LOW_DEPOSIT  (err u103))

(define-constant CONTRACT_OWNER  (as-contract tx-sender))

(define-constant BUFFER_CONSTANT 10) 
(define-constant MCR_CONSTANT 5) 
(define-constant REBALANCE_INTERVAL u0)

;; data vars
;;

;; total_cover
;; per 100 STX
(define-data-var price uint u4)
(define-data-var total_cover uint u0)
(define-data-var liquidity uint u0)
;; Minimal Capital Requirement
;; mcr = total_cover / MCR_CONSTANT
;; ;; But greater then initial_investment * 0.9
(define-data-var mcr int 0)
;; book_value = total_cover / token_supply
(define-data-var book_value uint u40)
;; virtual_target = book_value * (1 + BUFFER_CONSTANT)
(define-data-var virtual_target int 0)

(define-data-var latest_rebalance_time uint u0)
;; data maps
;;

(define-map deposits principal uint)

;; public functions
;;

;; Depositing STX
(define-public (deposit (amount uint))
  (begin
    (asserts! (> amount u1000) ERR_AMOUNT)
    (map-set deposits tx-sender (+ (get_deposit tx-sender) amount))
    (try! (stx-transfer? amount tx-sender (as-contract tx-sender)))
    (try! (contract-call? .token mint  (/ (* amount (var-get price)) u100) tx-sender))
    (var-set liquidity (+ (var-get liquidity) amount))
    (if (> (var-get latest_rebalance_time) REBALANCE_INTERVAL) (rebalance-pool) (ok true))
  )
)

;; Redeeming STX
(define-public (redeem (amount uint))
  (begin
    (asserts! (> amount u0) ERR_AMOUNT)
    (let ((deposited_amount (get_deposit tx-sender))) 
      ;; WTF
      ;; (asserts! (> deposited_amount u0) (err ERR_LOW_DEPOSIT))
      (map-set deposits tx-sender (- deposited_amount amount))
    )
    ;; (try! (stx-transfer? amount CONTRACT_OWNER tx-sender))
    (try! (contract-call? .token burn (/ (* amount (var-get price)) u100) tx-sender))
    (var-set liquidity (- (var-get liquidity) amount))
    (ok true)
  )
)



;; read only functions
;;

(define-read-only (get_deposit (who principal))
  (default-to u0 (map-get? deposits who)) 
)

(define-read-only (get_price)
  (var-get price) 
)



;; private functions
;;

(define-private (rebalance-pool)
  (begin 
    (var-set latest_rebalance_time u0) 
    (ok true)
  )
;; if (< liquidity virtual_target) (
;;   ;; Only transfer until liquidity pool is greated then mcr
;;   add_liquidity()
;; )

;; if (> liquidity virtual_target) (
;;   ;; Only transfer until liquidity pool is greated then mcr
;;   remove_liquidity()
;; )

)
