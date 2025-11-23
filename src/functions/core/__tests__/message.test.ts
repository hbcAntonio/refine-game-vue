import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import messageState from '../message'

describe('Message System', () => {
  beforeEach(() => {
    // Clear all messages before each test
    messageState.sd.messages = {}
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should add a message to the state', () => {
    messageState.clif_add_message('Test message', 1000)

    const messages = Object.values(messageState.sd.messages)
    expect(messages.length).toBe(1)
    expect(messages[0]).toBe('Test message')
  })

  it('should remove message after duration', () => {
    messageState.clif_add_message('Test message', 1000)

    expect(Object.keys(messageState.sd.messages).length).toBe(1)

    // Fast-forward time by 1000ms
    vi.advanceTimersByTime(1000)

    expect(Object.keys(messageState.sd.messages).length).toBe(0)
  })

  it('should handle multiple messages', () => {
    messageState.clif_add_message('Message 1', 2000)
    messageState.clif_add_message('Message 2', 2000)
    messageState.clif_add_message('Message 3', 2000)

    expect(Object.keys(messageState.sd.messages).length).toBe(3)
  })

  it('should use default duration when not specified', () => {
    messageState.clif_add_message('Test message')

    expect(Object.keys(messageState.sd.messages).length).toBe(1)

    // Default duration is 5000ms
    vi.advanceTimersByTime(4999)
    expect(Object.keys(messageState.sd.messages).length).toBe(1)

    vi.advanceTimersByTime(1)
    expect(Object.keys(messageState.sd.messages).length).toBe(0)
  })

  it('should generate unique IDs for messages', () => {
    messageState.clif_add_message('Message 1', 5000)
    messageState.clif_add_message('Message 2', 5000)

    const ids = Object.keys(messageState.sd.messages)
    expect(ids[0]).not.toBe(ids[1])
  })
})
