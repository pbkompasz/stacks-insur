
;; title: amm
;; version:
;; summary:
;; description: Automated Market Maker to provide liquidity for mint and redeem operations

;; if (< liquidity virtual_target) (
;;   ;; Only transfer until liquidity pool is greated then mcr
;;   add_liquidity()
;; )

;; if (> liquidity virtual_target) (
;;   ;; Only transfer until liquidity pool is greated then mcr
;;   remove_liquidity()
;; )



;; traits
;;

;; token definitions
;;

;; constants
;;
;; 10 / 100
(define-constant BUFFER_CONSTANT 10) 
(define-constant MCR_CONSTANT 5) 

;; data vars
;;
;; total_cover
;; liquidity
;; ;; But greater then initial_investment * 0.9
;; mcr = total_cover / MCR_CONSTANT
;; book_value = total_cover / token_supply
;; virtual_target = book_value * (1 + BUFFER_CONSTANT)
(define-data-var total_cover int 0)
(define-data-var liquidity int 0)
(define-data-var mcr int 0)
(define-data-var book_value int 0)
(define-data-var virtual_target int 0)

;; data maps
;;

;; public functions
;;

(define-public (start)
  (begin
  )
)

(define-public (mint (amount int))
  (begin
    (ok amount)
  )
)

(define-public (redeem)
  (begin
    (ok value)
  )
)



;; read only functions
;;

(define-read-only (get_total_cover)
  (ok (var-get total_cover))
)

;; private functions
;;

(define-private (rebalance-pool)
  (begin
    
  )
)
