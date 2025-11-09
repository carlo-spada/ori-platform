'use client'

import { useState, useEffect } from 'react'

interface EarlyAccessData {
  email: string
  firstName?: string
  timestamp: string
}

export function useEarlyAccess() {
  const [hasJoinedEarlyAccess, setHasJoinedEarlyAccess] = useState(true) // Default to true to prevent flash
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    // Check if user has already joined early access
    const stored = localStorage.getItem('ori-early-access')
    if (stored) {
      try {
        const data: EarlyAccessData = JSON.parse(stored)
        // Check if it's been less than 30 days since they joined
        const joinedDate = new Date(data.timestamp)
        const daysSinceJoined = (Date.now() - joinedDate.getTime()) / (1000 * 60 * 60 * 24)

        if (daysSinceJoined < 30) {
          setHasJoinedEarlyAccess(true)
        } else {
          // It's been over 30 days, they can join again if they want
          setHasJoinedEarlyAccess(false)
        }
      } catch {
        setHasJoinedEarlyAccess(false)
      }
    } else {
      setHasJoinedEarlyAccess(false)
    }
  }, [])

  const openEarlyAccessModal = () => {
    setShowModal(true)
  }

  const closeEarlyAccessModal = () => {
    setShowModal(false)
  }

  const handleAuthAction = (action: 'login' | 'signup') => {
    // Check if they've already joined
    if (!hasJoinedEarlyAccess) {
      openEarlyAccessModal()
      return false // Prevent default action
    }

    // If they have joined, still show the modal but with different messaging
    // or allow them through to a "coming soon" page
    openEarlyAccessModal()
    return false
  }

  return {
    hasJoinedEarlyAccess,
    showModal,
    openEarlyAccessModal,
    closeEarlyAccessModal,
    handleAuthAction,
  }
}