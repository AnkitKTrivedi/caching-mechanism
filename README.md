# 🚀 Distributed Caching Framework (Node.js + TypeScript + Redis)

A production-inspired caching framework built from scratch to understand how modern distributed systems implement caching, consistency, concurrency control, and performance optimization.

## Tech Stack

- Node.js
- TypeScript
- Express.js
- Redis
- Docker

---

# Implemented Topics

## 1. Generic Cache Abstraction

- Generic `ICache<T>` interface
- Reusable cache implementations

## 2. TTL Cache

- Generic TTL Cache
- Configurable TTL
- Lazy Expiration
- Active Expiration (Background Cleanup)

## 3. LRU Cache

- Doubly Linked List
- HashMap + Linked List
- O(1) Get
- O(1) Put
- O(1) Delete

## 4. LRU + TTL Cache

- LRU Eviction
- TTL Expiration
- Background Cleanup

## 5. Redis Cache

- Redis Configuration
- Generic Redis Cache
- Docker Integration
- JSON Serialization

## 6. Multi-Level Cache

- L1 Memory Cache
- L2 Redis Cache
- Cache Manager

## 7. Cache Aside Pattern

## 8. Write Through Caching

## 9. Cache Invalidation

## 10. Redis Distributed Lock

- Lock Acquire
- Lock Release
- Lock Ownership

## 11. Cache Stampede Prevention

## 12. SingleFlight Pattern

## 13. Refresh Ahead Caching

- Background Refresh Worker
- Loader Registry
- Automatic Cache Refresh

## 14. Redis Pub/Sub

- Publisher
- Subscriber
- Cross-Instance Cache Invalidation

---

# Cache Design Patterns

- Cache Aside
- Write Through
- Multi-Level Cache
- Refresh Ahead
- Publish / Subscribe
- SingleFlight
- Dependency Injection
- Repository Pattern

---

# Distributed System Concepts

- Multi-Level Caching
- Cache Consistency
- Cache Coherency
- Cache Invalidation
- Distributed Locking
- Event-Driven Architecture
- Background Workers
- Cross-Instance Cache Synchronization
- Concurrency Control
