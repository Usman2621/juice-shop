/*
 * Copyright (c) 2014-2026 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

import type { BasketItemModel } from 'models/basketitem'
import type { ChallengeKey, ChallengeModel } from 'models/challenge'
import type { ComplaintModel } from 'models/complaint'
import type { FeedbackModel } from 'models/feedback'
import type { ProductModel } from 'models/product'
import type { BasketModel } from 'models/basket'
import type { UserModel } from 'models/user'

import path from 'path'

/* jslint node: true */
export const challenges: Record<ChallengeKey, ChallengeModel> = {} as unknown as Record<ChallengeKey, ChallengeModel>
export const users: Record<string, UserModel> = {}
export const products: Record<string, ProductModel> = {}
export const feedback: Record<string, FeedbackModel> = {}
export const baskets: Record<string, BasketModel> = {}
export const basketItems: Record<string, BasketItemModel> = {}
export const complaints: Record<string, ComplaintModel> = {}

export interface Notification {
  key: string
  name: string
  challenge: string
  flag: string
  hidden: boolean
  isRestore: boolean
}
export const notifications: Notification[] = []

export let retrieveBlueprintChallengeFile: string | null = null

export function setRetrieveBlueprintChallengeFile (retrieveBlueprintChallengeFileArg: string) {
  retrieveBlueprintChallengeFile = retrieveBlueprintChallengeFileArg
}

/* --------------------------------------------------------------------------
   SECURITY ENHANCEMENTS (Integrated)
   -------------------------------------------------------------------------- */

/**
 * Prevent prototype pollution & unintended mutations
 */
Object.freeze(challenges)
Object.freeze(users)
Object.freeze(products)
Object.freeze(feedback)
Object.freeze(baskets)
Object.freeze(basketItems)
Object.freeze(complaints)
Object.freeze(notifications)

/**
 * Secure setter for path input — prevents directory traversal
 */
export function safeSetRetrieveBlueprintChallengeFile(input: string) {
  const resolved = path.resolve(input)
  const allowedDir = path.resolve('./blueprints')

  if (!resolved.startsWith(allowedDir)) {
    throw new Error('Security violation: invalid blueprint file path')
  }

  retrieveBlueprintChallengeFile = resolved
}

/**
 * Secure record setter (validates key & freezes stored object)
 */
export function secureSet<T extends object>(
  container: Record<string, T>,
  key: string,
  value: T
) {
  if (!/^[a-zA-Z0-9_-]+$/.test(key)) {
    throw new Error('Invalid key: unsafe characters used')
  }

  container[key] = Object.freeze({ ...value })
}

/**
 * Secure Notification creation
 */
export function addNotificationSecure(notification: Notification) {
  if (!notification.key || !notification.name) {
    throw new Error('Invalid notification')
  }
  notifications.push(Object.freeze({ ...notification }))
}
