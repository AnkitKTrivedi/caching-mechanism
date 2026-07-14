# Caching Strategies Implementation in TypeScript

A hands-on implementation of different caching strategies using **Node.js + TypeScript**.

# Tech Stack

* Node.js
* TypeScript
* Express.js
* Redis
* Docker

---

# Goals

This repo covers:

* In-memory caching
* TTL (Time To Live) based expiration
* Active expiration cleanup
* LRU (Least Recently Used) eviction
* Hybrid TTL + LRU cache
* Redis-based distributed caching

---

# Cache Architecture

The project follows an abstraction-based design.

```
                 ICache<T>
                    |
        ----------------------------
        |            |             |
 MemoryCache     TTLCache      RedisCache
                     |
                  LRU Cache
                     |
              TTL + LRU Cache
```

The application code depends on the cache interface instead of a specific implementation.

This allows switching between:

```
Memory Cache
      |
      |
      v
Redis Cache
```

without changing business logic.

---

# Cache Interface

All cache implementations follow:

```ts
export interface ICache<T> {

    get(key: string): Promise<T | undefined>;

    set(
        key: string,
        value: T,
        ttl?: number
    ): Promise<void>;

    delete(key: string): Promise<void>;

    clear(): Promise<void>;
}
```

---

# Implemented Caching Strategies

## 1. In-Memory Cache

Basic cache implementation using JavaScript Map.

Data structure:

```
Map<string, T>
```

Operations:

| Operation | Complexity |
| --------- | ---------- |
| get       | O(1)       |
| set       | O(1)       |
| delete    | O(1)       |

Example:

```ts
cache.set(
    "user:1",
    {
        id:1,
        name:"Ankit"
    }
);
```

---

# 2. TTL Cache

TTL means:

> A cached item has a lifetime after which it becomes invalid.

Example:

```
TTL = 5000ms


set()

        |
        |
        v

expiresAt = currentTime + 5000


after 5 seconds

        |
        |
        v

remove item
```

Features:

* Lazy expiration
* Active expiration cleanup
* Configurable TTL

Example:

```ts
const cache = new TTLCache<User>(
    5000
);
```

---

# Lazy Expiration

When requesting data:

```
get(key)

   |
   |
Check expiry

   |
   |
Expired?

   |
   +---- Yes
   |
Delete
```

Expired entries are removed only when accessed.

---

# Active Expiration

A background cleanup process removes expired keys.

Example:

```
Every 5 seconds

       |
       v

Scan cache

       |
       v

Remove expired entries
```

Implemented using:

```ts
setInterval()
```

---

# 3. LRU Cache

LRU means:

> Remove the item that has not been used for the longest time.

Example:

Capacity:

```
3 items
```

Cache:

```
A B C
```

Access:

```
get(A)
```

Order becomes:

```
B C A
```

Insert:

```
D
```

Remove:

```
B
```

because B is least recently used.

---

# LRU Data Structures

LRU uses two data structures.

## HashMap

For O(1) lookup.

```
key -> Node
```

## Doubly Linked List

For O(1) reordering.

```
HEAD

A <-> B <-> C

TAIL
```

Most recently used:

```
HEAD side
```

Least recently used:

```
TAIL side
```

---

# LRU Complexity

| Operation | Complexity |
| --------- | ---------- |
| get       | O(1)       |
| set       | O(1)       |
| delete    | O(1)       |
| eviction  | O(1)       |

---

# 4. Hybrid TTL + LRU Cache

Production caches often combine:

## TTL Expiration

Removes stale data.

```
Time based eviction
```

## LRU Eviction

Protects memory usage.

```
Capacity based eviction
```

Architecture:

```
              LRUTTLCache

                    |
        -------------------------
        |                       |
      Map              Doubly Linked List

        |
        |
    CacheNode

    key
    value
    expiresAt
    prev
    next
```

---

# Hybrid Cache Flow

## GET

```
get(key)

    |
    |
Find node in Map

    |
    |
Expired?

    |
 +--+--+
 |     |
Yes    No
 |      |
Remove Move to Front
 |      |
Return  Return value
undefined
```

---

## SET

```
set(key,value)

        |
        |
Existing key?

        |
   +----+----+
   |         |
 Yes         No

Update     Create Node

Move       Add to Map
Front      Add to List


        |
        |
Capacity exceeded?

        |
        |
Remove LRU item
```

---

# Redis Cache

Redis is used when:

* Multiple application servers exist
* Cache needs to be shared
* Cache should survive application restarts

Architecture:

```
              Load Balancer

              /        \

          Node 1       Node 2

              \        /

                 Redis
```

Both servers use the same cache.

---

# Redis Setup

Run Redis using Docker:

```bash
docker run -d \
--name redis \
-p 6379:6379 \
redis:7
```

Verify:

```bash
docker ps
```

---

# Redis Client Installation

```bash
npm install redis
```

---

# Redis Data Flow

Application object:

```json
{
  "id":1,
  "name":"Ankit"
}
```

Stored in Redis:

```
JSON.stringify()

        |

        v

Redis String
```

Retrieved:

```
Redis String

        |

        v

JSON.parse()

        |

        v

Object
```
