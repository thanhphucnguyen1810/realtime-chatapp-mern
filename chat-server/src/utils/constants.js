import { env } from '~/config/environment'

// NHỮNG DOMAIN ĐƯỢC PHÉP TRUY CẬP TỚI TÀI NGUYÊN CỦA SERVER
export const WHITELIST_DOMAINS = [
  'http://localhost:3000'
  // sau này sẽ deploy lên domain chính thức
  // 'https://trello-app.netlify.app': VD
]


// export const WEBSITE_DOMAIN = (env.BUILD_MODE === 'production') ? env.WEBSITE_DOMAIN_PRODUCTION : env.WEBSITE_DOMAIN_DEVELOPMENT
// export const DEFAULT_PAGE = 1
// export const DEFAULT_ITEMS_PER_PAGE = 12


