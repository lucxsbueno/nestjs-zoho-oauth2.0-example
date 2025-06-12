# Zoho Integration

Integration with Zoho CRM API. This project provides an interface to interact with Zoho CRM, allowing contact search, email account management, and other CRM functionalities.

## Description

This project implements a robust integration with Zoho CRM, offering:

- OAuth2 authentication with Zoho
- Automatic access token management
- Secure token storage in database
- API error and rate limit handling
- Contact management
- Email account management

## Project Structure

```
src/
├── auth/
│   ├── auth.controller.ts    # Authentication controller
│   ├── auth.service.ts       # Authentication service
│   ├── auth.module.ts        # Authentication module
│   └── token.service.ts      # Token management service
├── contacts/
│   ├── contacts.controller.ts # Contacts controller
│   ├── contacts.service.ts    # Contacts service
│   └── contacts.module.ts     # Contacts module
├── emails/
│   ├── emails.controller.ts   # Emails controller
│   ├── emails.service.ts      # Emails service
│   └── emails.module.ts       # Emails module
├── prisma/
│   └── schema.prisma         # Database schema
└── app.module.ts             # Main application module
```

## Components

### Auth Module (`src/auth/auth.module.ts`)

```typescript
@Module({
  controllers: [AuthController],
  providers: [AuthService, TokenService, PrismaService],
  exports: [AuthService],
})
```

- Manages all authentication
- Exports `AuthService` for use by other modules
- Uses `TokenService` for token management
- Uses `PrismaService` for database operations

### Auth Controller (`src/auth/auth.controller.ts`)

```typescript
@Controller('auth')
export class AuthController {
  @Get('zoho')
  redirectToZoho() {
    return this.authService.getAuthUrl();
  }

  @Get('callback')
  async handleCallback(@Query('code') code: string) {
    return await this.authService.exchangeCodeForToken(code);
  }
}
```

- Endpoint `/auth/zoho`: Returns Zoho authentication URL
- Endpoint `/auth/callback`: Receives authorization code from Zoho

### Auth Service (`src/auth/auth.service.ts`)

```typescript
@Injectable()
export class AuthService {
  getAuthUrl(): string {
    // Generates authentication URL with required scopes
  }

  async exchangeCodeForToken(code: string) {
    // Exchanges code for access token and refresh token
  }

  async getValidAccessToken(): Promise<string> {
    // Gets a valid access token, refreshing if necessary
  }
}
```

- Manages entire authentication flow
- Generates authentication URLs
- Exchanges codes for tokens
- Manages token refresh

### Token Service (`src/auth/token.service.ts`)

```typescript
@Injectable()
export class TokenService {
  async saveToken(data: any) {
    // Saves token to database
  }

  async getLatestToken() {
    // Gets the most recent token
  }
}
```

- Manages token storage
- Saves tokens to database
- Retrieves tokens when needed

### Contacts Module (`src/contacts/contacts.module.ts`)

```typescript
@Module({
  imports: [AuthModule],
  controllers: [ContactsController],
  providers: [ContactsService],
})
```

- Manages contact-related operations
- Imports `AuthModule` for authentication
- Provides contact management endpoints

### Contacts Controller (`src/contacts/contacts.controller.ts`)

```typescript
@Controller('contacts')
export class ContactsController {
  @Get('search')
  async searchContact(@Query('email') email: string) {
    return this.contactsService.searchContactByEmail(email);
  }
}
```

- Endpoints for contact management
- Uses `ContactsService` for API requests

### Emails Module (`src/emails/emails.module.ts`)

```typescript
@Module({
  imports: [AuthModule],
  controllers: [EmailsController],
  providers: [EmailsService],
})
```

- Manages email account operations
- Imports `AuthModule` for authentication
- Provides email management endpoints

### Emails Controller (`src/emails/emails.controller.ts`)

```typescript
@Controller('emails')
export class EmailsController {
  @Get('accounts')
  async getAllMailAccounts() {
    return this.emailsService.getAllMailAccounts();
  }
}
```

- Endpoints for email account management
- Uses `EmailsService` for API requests

### Prisma Schema (`prisma/schema.prisma`)

```prisma
model Token {
  id           Int      @id @default(autoincrement())
  accessToken  String
  refreshToken String
  expiresIn    Int
  createdAt    DateTime @default(now())
}
```

- Defines database structure
- Stores access tokens

## Flow

1. User accesses `/auth/zoho`
2. Redirected to Zoho login
3. After login, Zoho redirects to `/auth/callback` with code
4. System exchanges code for tokens
5. Tokens are saved to database
6. When making API request:
   - Checks if access token is valid
   - If expired, uses refresh token to get new one
   - Makes request with valid token

## Token Management

### Access Token

- Valid for 1 hour
- Maximum 15 active tokens per refresh token
- Maximum 10 tokens generated in 10 minutes

### Refresh Token

- Permanent until revoked
- Maximum 20 refresh tokens per user
- Does not expire automatically

### System Behavior

- Only refreshes when access token actually expires
- Maintains existing refresh token
- Avoids unnecessary requests

## Error Handling

- `invalid_grant`: Invalid/revoked refresh token
- `Access Denied`: Too many requests in 10 minutes
- `INVALID_OAUTHTOKEN`: Invalid token (more than 15 active tokens)

## Configuration

Create a `.env` file in the project root with the following variables:

```env
DATABASE_URL="file:./dev.db"
ZOHO_CLIENT_ID="your_client_id"
ZOHO_CLIENT_SECRET="your_client_secret"
ZOHO_REDIRECT_URI="http://localhost:3333/auth/callback"
ZOHO_SCOPE="ZohoCRM.modules.ALL,ZohoCRM.settings.ALL"
ZOHO_API_ACCOUNT="https://accounts.zoho.com"
```

## Installation

```bash
# Install dependencies
npm install

# Configure database
npx prisma generate
npx prisma db push

# Start application
npm run start:dev
```

## Usage

1. Access `http://localhost:3333/auth/zoho`
2. Login to Zoho
3. Authorize the application
4. Use the API endpoints:
   - `GET /contacts/search?email=example@email.com`
   - `GET /emails/accounts`

## Build and Deployment

### Development

```bash
# Start development server
npm run start:dev

# Watch mode
npm run start:debug
```

### Production

```bash
# Build the application
npm run build

# Start production server
npm run start:prod
```

### Environment Variables

Make sure to set the following environment variables in production:

- `DATABASE_URL`: Your production database URL
- `ZOHO_CLIENT_ID`: Your Zoho client ID
- `ZOHO_CLIENT_SECRET`: Your Zoho client secret
- `ZOHO_REDIRECT_URI`: Your production callback URL
- `ZOHO_SCOPE`: Required Zoho API scopes
- `ZOHO_API_ACCOUNT`: Zoho API account URL

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
