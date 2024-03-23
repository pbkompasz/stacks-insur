
;; title: cover
;; version: 0.1
;; summary: Manage covers
;; description: Create, update, vote and claim covers

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
(define-data-var beneficiary (optional principal) none)
(define-data-var unlock-height uint u0)

;; data vars
;;

;; data maps
;;

;; public functions
;;

;; read only functions
;;

;; private functions
;;


