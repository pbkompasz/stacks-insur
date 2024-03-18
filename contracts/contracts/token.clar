
;; title: token
;; version:
;; summary:
;; description:

(impl-trait  .sip-10.sip-10-trait)

;; traits
;;

;; token definitions
;;
(define-fungible-token token-name)

;; constants
;;
(define-constant ERR_OWNER_ONLY  (err u100))
(define-constant ERR_NOT_TOKEN_OWNER  (err u100))

(define-constant CONTRACT_OWNER  tx-sender)
(define-constant TOKEN_URI u"https://clarity-lang.org")
(define-constant TOKEN_NAME  "Token Name")
(define-constant TOKEN_SYMBOL  "TN")
(define-constant TOKEN_DECIMALS  u6)

;; data vars
;;

;; data maps
;;

;; public functions
;;
;; #[allow(unchecked_data)]
(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34)))) 
  (begin
    (try! (ft-transfer? token-name amount sender recipient))
    (match memo to-print
      (print to-print) 
      0x
    )
    (ok true)
  )
)

(define-public (mint (amount uint) (recipient principal)) 
  (begin 
    (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_OWNER_ONLY) 
    (ft-mint? token-name amount recipient)
  )
)

;; read only functions
;;
(define-read-only (get-balance (who principal))
  (ok (ft-get-balance token-name who))
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
  (ok (ft-get-supply token-name))
)

(define-read-only (get-token-uri) 
  (ok (some TOKEN_URI))
)


;; private functions
;;

