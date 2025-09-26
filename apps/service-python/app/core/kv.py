import os
from typing import Optional

import httpx


class KVClient:
    def __init__(self):
        self.rest_api_url = os.getenv("KV_REST_API_URL")
        self.rest_api_token = os.getenv("KV_REST_API_TOKEN")

        if not self.rest_api_url or not self.rest_api_token:
            # KV is optional, just log warnings
            print("Warning: KV_REST_API_URL or KV_REST_API_TOKEN not configured. Analytics will use fallbacks.")
            self.enabled = False
        else:
            self.enabled = True

    async def _make_request(self, method: str, endpoint: str, data: dict = None) -> Optional[dict]:
        """Make request to KV REST API"""
        if not self.enabled:
            return None

        headers = {
            "Authorization": f"Bearer {self.rest_api_token}",
            "Content-Type": "application/json"
        }

        url = f"{self.rest_api_url.rstrip('/')}/{endpoint}"

        try:
            async with httpx.AsyncClient() as client:
                if method == "GET":
                    response = await client.get(url, headers=headers)
                else:
                    response = await client.post(url, headers=headers, json=data or {})

                if response.status_code == 200:
                    return response.json()
                else:
                    print(f"KV API error: {response.status_code} - {response.text}")
                    return None
        except Exception as e:
            print(f"KV request failed: {e}")
            return None

    async def incr(self, key: str, by: int = 1) -> int:
        """Increment a key by specified amount"""
        result = await self._make_request("POST", "incr", {"key": key, "increment": by})
        return result.get("result", 0) if result else by  # Fallback to increment value

    async def get_int(self, key: str) -> int:
        """Get integer value for key"""
        result = await self._make_request("POST", "get", {"key": key})
        if result and result.get("result") is not None:
            try:
                return int(result["result"])
            except (ValueError, TypeError):
                pass
        return 0

    async def sadd(self, key: str, member: str) -> int:
        """Add member to set"""
        result = await self._make_request("POST", "sadd", {"key": key, "members": [member]})
        return result.get("result", 1) if result else 1

    async def srem(self, key: str, member: str) -> int:
        """Remove member from set"""
        result = await self._make_request("POST", "srem", {"key": key, "members": [member]})
        return result.get("result", 1) if result else 1

    async def scard(self, key: str) -> int:
        """Get set cardinality (size)"""
        result = await self._make_request("POST", "scard", {"key": key})
        return result.get("result", 0) if result else 0

    async def sismember(self, key: str, member: str) -> bool:
        """Check if member is in set"""
        result = await self._make_request("POST", "sismember", {"key": key, "member": member})
        return bool(result.get("result", 0)) if result else False

# Global KV client instance
kv = KVClient()
