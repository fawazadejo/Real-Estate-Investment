;; Property Verification Contract
;; This contract validates the legal status and condition of real estate

(define-data-var contract-owner principal tx-sender)

;; Property struct to store property details
(define-map properties
  { property-id: uint }
  {
    owner: principal,
    verified: bool,
    address: (string-utf8 256),
    value: uint,
    last-inspection-date: uint
  }
)

;; Verifiers map to store authorized verifiers
(define-map verifiers
  { verifier: principal }
  { authorized: bool }
)

;; Error codes
(define-constant err-not-owner (err u100))
(define-constant err-not-verifier (err u101))
(define-constant err-property-exists (err u102))
(define-constant err-property-not-found (err u103))

;; Initialize contract
(define-public (initialize)
  (begin
    (asserts! (is-eq tx-sender (var-get contract-owner)) err-not-owner)
    (ok true)
  )
)

;; Add a verifier
(define-public (add-verifier (verifier principal))
  (begin
    (asserts! (is-eq tx-sender (var-get contract-owner)) err-not-owner)
    (map-set verifiers { verifier: verifier } { authorized: true })
    (ok true)
  )
)

;; Remove a verifier
(define-public (remove-verifier (verifier principal))
  (begin
    (asserts! (is-eq tx-sender (var-get contract-owner)) err-not-owner)
    (map-set verifiers { verifier: verifier } { authorized: false })
    (ok true)
  )
)

;; Register a new property
(define-public (register-property
    (property-id uint)
    (address (string-utf8 256))
    (value uint))
  (let ((property-exists (map-get? properties { property-id: property-id })))
    (asserts! (is-none property-exists) err-property-exists)
    (map-set properties
      { property-id: property-id }
      {
        owner: tx-sender,
        verified: false,
        address: address,
        value: value,
        last-inspection-date: u0
      }
    )
    (ok true)
  )
)

;; Verify a property
(define-public (verify-property
    (property-id uint)
    (inspection-date uint))
  (let (
    (verifier-status (map-get? verifiers { verifier: tx-sender }))
    (property (map-get? properties { property-id: property-id }))
  )
    (asserts! (and (is-some verifier-status) (get authorized (unwrap! verifier-status err-not-verifier))) err-not-verifier)
    (asserts! (is-some property) err-property-not-found)

    (map-set properties
      { property-id: property-id }
      (merge (unwrap! property err-property-not-found)
        {
          verified: true,
          last-inspection-date: inspection-date
        }
      )
    )
    (ok true)
  )
)

;; Check if a property is verified - fixed to properly handle optional
(define-read-only (is-property-verified (property-id uint))
  (let ((property (map-get? properties { property-id: property-id })))
    (if (is-some property)
      (get verified (unwrap-panic property))
      false
    )
  )
)

;; Get property details
(define-read-only (get-property (property-id uint))
  (map-get? properties { property-id: property-id })
)

