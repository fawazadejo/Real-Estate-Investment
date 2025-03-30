import { describe, it, expect, beforeEach } from "vitest"

// Mock the Clarity contract functions
const mockProperties = new Map()
const mockVerifiers = new Map()
let mockTxSender = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM" // Example address
const mockContractOwner = mockTxSender

// Mock contract functions
const contractFunctions = {
  initialize: () => {
    if (mockTxSender !== mockContractOwner) {
      return { type: "err", value: 100 } // err-not-owner
    }
    return { type: "ok", value: true }
  },
  
  addVerifier: (verifier) => {
    if (mockTxSender !== mockContractOwner) {
      return { type: "err", value: 100 } // err-not-owner
    }
    mockVerifiers.set(verifier, { authorized: true })
    return { type: "ok", value: true }
  },
  
  removeVerifier: (verifier) => {
    if (mockTxSender !== mockContractOwner) {
      return { type: "err", value: 100 } // err-not-owner
    }
    mockVerifiers.set(verifier, { authorized: false })
    return { type: "ok", value: true }
  },
  
  registerProperty: (propertyId, address, value) => {
    if (mockProperties.has(propertyId)) {
      return { type: "err", value: 102 } // err-property-exists
    }
    mockProperties.set(propertyId, {
      owner: mockTxSender,
      verified: false,
      address,
      value,
      lastInspectionDate: 0,
    })
    return { type: "ok", value: true }
  },
  
  verifyProperty: (propertyId, inspectionDate) => {
    const verifierStatus = mockVerifiers.get(mockTxSender)
    if (!verifierStatus || !verifierStatus.authorized) {
      return { type: "err", value: 101 } // err-not-verifier
    }
    
    if (!mockProperties.has(propertyId)) {
      return { type: "err", value: 103 } // err-property-not-found
    }
    
    const property = mockProperties.get(propertyId)
    property.verified = true
    property.lastInspectionDate = inspectionDate
    mockProperties.set(propertyId, property)
    
    return { type: "ok", value: true }
  },
  
  isPropertyVerified: (propertyId) => {
    if (!mockProperties.has(propertyId)) {
      return false
    }
    return mockProperties.get(propertyId).verified
  },
  
  getProperty: (propertyId) => {
    if (!mockProperties.has(propertyId)) {
      return null
    }
    return mockProperties.get(propertyId)
  },
}

describe("Property Verification Contract", () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockProperties.clear()
    mockVerifiers.clear()
    mockTxSender = mockContractOwner
  })
  
  it("should initialize the contract", () => {
    const result = contractFunctions.initialize()
    expect(result.type).toBe("ok")
    expect(result.value).toBe(true)
  })
  
  it("should fail to initialize if not owner", () => {
    mockTxSender = "ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG" // Different address
    const result = contractFunctions.initialize()
    expect(result.type).toBe("err")
    expect(result.value).toBe(100) // err-not-owner
  })
  
  it("should add a verifier", () => {
    const verifier = "ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG"
    const result = contractFunctions.addVerifier(verifier)
    expect(result.type).toBe("ok")
    
    const verifierStatus = mockVerifiers.get(verifier)
    expect(verifierStatus).toBeDefined()
    expect(verifierStatus.authorized).toBe(true)
  })
  
  it("should register a property", () => {
    const propertyId = 1
    const address = "123 Main St"
    const value = 500000
    
    const result = contractFunctions.registerProperty(propertyId, address, value)
    expect(result.type).toBe("ok")
    
    const property = mockProperties.get(propertyId)
    expect(property).toBeDefined()
    expect(property.address).toBe(address)
    expect(property.value).toBe(value)
    expect(property.verified).toBe(false)
  })
  
  it("should verify a property", () => {
    // First register a property
    const propertyId = 1
    const address = "123 Main St"
    const value = 500000
    contractFunctions.registerProperty(propertyId, address, value)
    
    // Add a verifier
    const verifier = "ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG"
    contractFunctions.addVerifier(verifier)
    
    // Set tx-sender to the verifier
    mockTxSender = verifier
    
    // Verify the property
    const inspectionDate = 12345
    const result = contractFunctions.verifyProperty(propertyId, inspectionDate)
    expect(result.type).toBe("ok")
    
    // Check if property is verified
    const property = mockProperties.get(propertyId)
    expect(property.verified).toBe(true)
    expect(property.lastInspectionDate).toBe(inspectionDate)
    
    // Check isPropertyVerified function
    const isVerified = contractFunctions.isPropertyVerified(propertyId)
    expect(isVerified).toBe(true)
  })
  
  it("should fail to verify if not an authorized verifier", () => {
    // First register a property
    const propertyId = 1
    const address = "123 Main St"
    const value = 500000
    contractFunctions.registerProperty(propertyId, address, value)
    
    // Set tx-sender to a non-verifier
    mockTxSender = "ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG"
    
    // Try to verify the property
    const inspectionDate = 12345
    const result = contractFunctions.verifyProperty(propertyId, inspectionDate)
    expect(result.type).toBe("err")
    expect(result.value).toBe(101) // err-not-verifier
    
    // Check if property is still unverified
    const property = mockProperties.get(propertyId)
    expect(property.verified).toBe(false)
  })
})

