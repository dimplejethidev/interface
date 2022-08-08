# Aqueduct Interface

## Getting Started

1. Create a `.env.local` file in the root directory and add the following environment variables:

```bash
NEXT_PUBLIC_SUPER_APP_ADDRESS=0xabc..123
NEXT_PUBLIC_FDAI_ADDRESS=0xabc..123
NEXT_PUBLIC_AQUEDUCT_TOKEN0_ADDRESS=0xabc..123
NEXT_PUBLIC_AQUEDUCT_TOKEN1_ADDRESS=0xabc..123
```

2. `yarn install`
3. `yarn dev`

You might need to start a stream by transfering a discrete amount to the pool. You may get this error if you don't: `execution reverted: CFA: not enough available balance`
