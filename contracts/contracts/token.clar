
;; title: token
;; version:
;; summary:
;; description:

;; (impl-trait  .sip-10.sip-10-trait)
(impl-trait 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-010-trait-ft-standard.sip-010-trait)

;; traits
;;

;; token definitions
;;
(define-fungible-token deins-mutual)

;; constants
;;
(define-constant ERR_OWNER_ONLY  (err u100))
(define-constant ERR_NOT_TOKEN_OWNER  (err u100))

(define-constant CONTRACT_OWNER  (as-contract tx-sender))
(define-constant TOKEN_URI u"https://clarity-lang.org")
(define-constant TOKEN_NAME  "DeIns Mutual")
(define-constant TOKEN_SYMBOL  "DIM")
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
    (try! (ft-transfer? deins-mutual amount sender recipient))
    (match memo to-print
      (print to-print) 
      0x
    )
    (ok true)
  )
)

(define-public (mint (amount uint) (recipient principal)) 
  (begin 
    ;; (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_OWNER_ONLY) 
    (ft-mint? deins-mutual amount recipient)
  )
)

(define-public (burn (amount uint) (recipient principal)) 
  (begin 
    ;; (asserts! (is-eq tx-sender CONTRACT_OWNER) ERR_OWNER_ONLY) 
    (ft-burn? deins-mutual amount recipient)
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

;; private functions
;;

