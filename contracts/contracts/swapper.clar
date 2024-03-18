
;; title: swapper
;; version:
;; summary:
;; description:

;; traits
;;
(use-trait sip10-token .sip-10.sip-10-trait)

;; token definitions
;;

;; constants
;;

;; data vars
;;

;; data maps
;;

;; public functions
;;
(define-public (swap (from-token <sip10-token>) (to-token <sip10-token>) (amount uint)) 
  (begin
    (try! (contract-call? from-token transfer amount tx-sender (as-contract tx-sender) none)) 
    (try! (contract-call? to-token transfer amount (as-contract tx-sender) tx-sender none)) 
    (ok true)
  )
)

;; read only functions
;;

;; private functions
;;

