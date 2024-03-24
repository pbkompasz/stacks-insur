
;; title: Token + Automated Market Maker
;; version: 0.2
;; summary: Deposit and redeem DIM tokens
;; description: Automated Market Maker to provide liquidity for mint and redeem operations

;; traits
;;
(impl-trait 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-010-trait-ft-standard.sip-010-trait)

;; token definitions
;;
(define-fungible-token deins-mutual)

;; total_cover
;; relative to 1  microSTX
(define-data-var price uint u400)
(define-data-var total_cover uint u0)
(define-data-var liquidity uint u0)
(define-data-var liquidity_token uint u0)
;; Minimal Capital Requirement
;; mcr = total_cover / MCR_CONSTANT
;; ;; But greater then initial_investment * 0.9
(define-data-var mcr uint u0)
;; book_value = total_cover / liquidity_token
(define-data-var book_value uint u40)
;; virtual_target = book_value * (1 + BUFFER_CONSTANT)
(define-data-var virtual_target uint u0)

(define-data-var latest_rebalance_time uint u0)

;; data maps
;;

(define-map deposits principal uint)

;; NOTE This has to be called from CONTRACT_OWNER
(define-map returns principal uint)


;; constants
;;
(define-constant ERR_OWNER_ONLY  (err u100))
(define-constant ERR_REINIT  (err u101))
(define-constant ERR_AMOUNT  (err u102))
(define-constant ERR_LOW_DEPOSIT  (err u103))
(define-constant ERR_NOT_TOKEN_OWNER  (err u100))
(define-constant ERR_NO_GET  (err u200))

(define-constant CONTRACT_OWNER .amm)
(define-constant TOKEN_URI u"https://clarity-lang.org")
(define-constant TOKEN_NAME  "DeIns Mutual")
(define-constant TOKEN_SYMBOL  "DIM")
(define-constant TOKEN_DECIMALS  u6)

(define-constant BUFFER_CONSTANT 10) 
(define-constant MCR_CONSTANT u5) 
(define-constant REBALANCE_INTERVAL u0)

;; private functions
;;

(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34)))) 
  (err u1)
)

;; Amount in microSTX
(define-public (mint (amount uint)) 
  (begin 
    (asserts! (> amount u1000) ERR_AMOUNT)
    (map-set deposits tx-sender (+ (get_deposit tx-sender) amount))
    (try! (stx-transfer? amount tx-sender CONTRACT_OWNER))
    (var-set liquidity (+ (var-get liquidity) amount))
    (var-set liquidity_token (+ (var-get liquidity_token) (* amount (var-get price))))
    (try! (ft-mint? deins-mutual (* amount (var-get price)) tx-sender))
    (var-set latest_rebalance_time (+ (var-get latest_rebalance_time) u1))
    (if (> (var-get latest_rebalance_time) u20) (update_internals) (ok true))
  )
)

;; Amount in microDIM
(define-public (burn (amount uint) ) 
  (begin 
    (asserts! (> amount u0) ERR_AMOUNT)
    (map-set deposits tx-sender (- (get_deposit tx-sender) amount))
    (var-set liquidity (- (var-get liquidity) amount))
    (var-set liquidity_token (- (var-get liquidity_token) (* amount (var-get price))))
    (try! (ft-burn? deins-mutual (* amount (var-get price)) tx-sender))
    (map-set returns tx-sender (+ (unwrap! (map-get? returns tx-sender) (err u2134)) amount))
    (if (> (var-get latest_rebalance_time) u20) (update_internals) (ok true))
  )
)

(define-public (redeem (recipient principal))
  (begin
  ;; TODO Check owner
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_NOT_TOKEN_OWNER)
    (let ((amount (unwrap! (map-get? returns recipient) (err u2134)))) 
      (asserts! (> amount u0) (err u3124))
      (try! (stx-transfer? amount CONTRACT_OWNER tx-sender))
    )
    (map-set returns recipient u0)
    (ok true)
  )
)

(define-public (stake-adjust-deposit (staker principal) (amount uint)) 
  (begin 
    (asserts! (valid-amount amount) ERR_AMOUNT)
    (asserts! (> (unwrap! (map-get? deposits staker) ERR_NO_GET) amount) ERR_LOW_DEPOSIT)
    (ok (map-set deposits staker (- (unwrap! (map-get? deposits staker) (err u1234)) amount)))
  )
)

;; read only functions
;;
(define-read-only (get-balance (who principal))
  (ok (ft-get-balance deins-mutual who))
)

(define-read-only (get-decimals)
  (ok TOKEN_DECIMALS)
)

(define-read-only (get-name)
  (ok TOKEN_NAME)
)

(define-read-only (get-symbol)
  (ok TOKEN_SYMBOL)
)

(define-read-only (get-total-supply)
  (ok (ft-get-supply deins-mutual))
)

(define-read-only (get-token-uri) 
  (ok (some TOKEN_URI))
)

(define-read-only (get-owner) 
  (ok (some CONTRACT_OWNER))
)

(define-read-only (get_deposit (who principal))
  (default-to u0 (map-get? deposits who)) 
)

(define-read-only (get_price)
  (var-get price) 
)

;; private functions
;;

(define-private (update_internals) 
  (begin
    (let ((new_book_value (/ (var-get total_cover) (var-get liquidity_token)))) 
      (if (>= new_book_value (var-get book_value)) 
        (var-set price (+ (var-get price) u1)) 
        (var-set price (- (var-get price) u1)) 
      )   
    )
    (var-set book_value (/ (var-get total_cover) (var-get liquidity_token)))
    (var-set mcr (/ (* (var-get total_cover) MCR_CONSTANT) u100))
    (ok true)
  )
)

(define-private (valid-amount (amount uint)) 
  (> amount u0)
)

(define-read-only (get_owner) 
  (ok (some CONTRACT_OWNER))
)
