import React from 'react'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      // allow any intrinsic elements fallback (helps editors that miss react types)
      [elemName: string]: any
    }
  }
}
export {}
