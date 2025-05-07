Object.defineProperty(exports, '__esModule', { value: true })

const {
	PrismaClientKnownRequestError,
	PrismaClientUnknownRequestError,
	PrismaClientRustPanicError,
	PrismaClientInitializationError,
	PrismaClientValidationError,
	getPrismaClient,
	sqltag,
	empty,
	join,
	raw,
	skip,
	Decimal,
	Debug,
	objectEnumValues,
	makeStrictEnum,
	Extensions,
	warnOnce,
	defineDmmfProperty,
	Public,
	getRuntime,
	createParam
} = require('./runtime/edge.js')

const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 6.5.0
 * Query Engine version: 4123509d24aa4dede1e864b46351bf2790323b69
 */
Prisma.prismaVersion = {
	client: '6.5.0',
	engine: '4123509d24aa4dede1e864b46351bf2790323b69'
}

Prisma.PrismaClientKnownRequestError = PrismaClientKnownRequestError
Prisma.PrismaClientUnknownRequestError = PrismaClientUnknownRequestError
Prisma.PrismaClientRustPanicError = PrismaClientRustPanicError
Prisma.PrismaClientInitializationError = PrismaClientInitializationError
Prisma.PrismaClientValidationError = PrismaClientValidationError
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = sqltag
Prisma.empty = empty
Prisma.join = join
Prisma.raw = raw
Prisma.validator = Public.validator

/**
 * Extensions
 */
Prisma.getExtensionContext = Extensions.getExtensionContext
Prisma.defineExtension = Extensions.defineExtension

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
	DbNull: objectEnumValues.classes.DbNull,
	JsonNull: objectEnumValues.classes.JsonNull,
	AnyNull: objectEnumValues.classes.AnyNull
}

/**
 * Enums
 */
exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
	ReadUncommitted: 'ReadUncommitted',
	ReadCommitted: 'ReadCommitted',
	RepeatableRead: 'RepeatableRead',
	Serializable: 'Serializable'
})

exports.Prisma.RoleScalarFieldEnum = {
	id: 'id',
	name: 'name'
}

exports.Prisma.AccountRoleScalarFieldEnum = {
	id: 'id',
	accountId: 'accountId',
	roleId: 'roleId',
	createdAt: 'createdAt',
	updatedAt: 'updatedAt'
}

exports.Prisma.CartScalarFieldEnum = {
	id: 'id',
	accountId: 'accountId',
	productId: 'productId',
	quantity: 'quantity',
	createdAt: 'createdAt',
	updatedAt: 'updatedAt'
}

exports.Prisma.CategoryScalarFieldEnum = {
	id: 'id',
	title: 'title',
	imageUrl: 'imageUrl',
	createdAt: 'createdAt',
	updatedAt: 'updatedAt'
}

exports.Prisma.IngredientScalarFieldEnum = {
	id: 'id',
	title: 'title',
	imageUrl: 'imageUrl',
	createdAt: 'createdAt',
	updatedAt: 'updatedAt'
}

exports.Prisma.ProductIngredientsScalarFieldEnum = {
	id: 'id',
	productId: 'productId',
	ingredientId: 'ingredientId',
	createdAt: 'createdAt',
	updatedAt: 'updatedAt'
}

exports.Prisma.ProductScalarFieldEnum = {
	id: 'id',
	title: 'title',
	description: 'description',
	weight: 'weight',
	imageUrl: 'imageUrl',
	price: 'price',
	onSale: 'onSale',
	categoryId: 'categoryId',
	createdAt: 'createdAt',
	updatedAt: 'updatedAt'
}

exports.Prisma.FavoriteScalarFieldEnum = {
	id: 'id',
	productId: 'productId',
	accountId: 'accountId',
	createdAt: 'createdAt',
	updatedAt: 'updatedAt'
}

exports.Prisma.AccountSettingsScalarFieldEnum = {
	id: 'id',
	accountId: 'accountId',
	telegramId: 'telegramId',
	isVerifiedEmail: 'isVerifiedEmail',
	isTwoFactorEmailEnabled: 'isTwoFactorEmailEnabled',
	isTwoFactorTotpEnabled: 'isTwoFactorTotpEnabled',
	totpSecret: 'totpSecret',
	siteNotification: 'siteNotification',
	telegramNotification: 'telegramNotification'
}

exports.Prisma.AccountScalarFieldEnum = {
	id: 'id',
	email: 'email',
	password: 'password',
	userName: 'userName',
	picture: 'picture',
	createdAt: 'createdAt',
	updatedAt: 'updatedAt'
}

exports.Prisma.DeliveryAddressScalarFieldEnum = {
	id: 'id',
	accountId: 'accountId',
	city: 'city',
	street: 'street',
	house: 'house',
	flat: 'flat',
	createdAt: 'createdAt',
	updatedAt: 'updatedAt'
}

exports.Prisma.OrderScalarFieldEnum = {
	id: 'id',
	status: 'status',
	firstName: 'firstName',
	lastName: 'lastName',
	phone: 'phone',
	email: 'email',
	deliveryAddressId: 'deliveryAddressId',
	deliveryAddress: 'deliveryAddress',
	deliveryType: 'deliveryType',
	paymentMethod: 'paymentMethod',
	paymentStatus: 'paymentStatus',
	comment: 'comment',
	total: 'total',
	accountId: 'accountId',
	createdAt: 'createdAt',
	updatedAt: 'updatedAt'
}

exports.Prisma.OrderItemScalarFieldEnum = {
	id: 'id',
	orderId: 'orderId',
	quantity: 'quantity',
	price: 'price',
	productTitle: 'productTitle',
	productDescription: 'productDescription',
	productImageUrl: 'productImageUrl',
	productId: 'productId',
	createdAt: 'createdAt',
	updatedAt: 'updatedAt'
}

exports.Prisma.ProductCommentScalarFieldEnum = {
	id: 'id',
	comment: 'comment',
	rating: 'rating',
	parentId: 'parentId',
	productId: 'productId',
	accountId: 'accountId',
	createdAt: 'createdAt',
	updatedAt: 'updatedAt'
}

exports.Prisma.PostScalarFieldEnum = {
	id: 'id',
	title: 'title',
	description: 'description',
	imageUrl: 'imageUrl',
	published: 'published',
	authorId: 'authorId',
	createdAt: 'createdAt',
	updatedAt: 'updatedAt'
}

exports.Prisma.PostCommentScalarFieldEnum = {
	id: 'id',
	comment: 'comment',
	authorId: 'authorId',
	postId: 'postId',
	createdAt: 'createdAt',
	updatedAt: 'updatedAt'
}

exports.Prisma.PostLikeScalarFieldEnum = {
	id: 'id',
	postId: 'postId',
	accountId: 'accountId',
	createdAt: 'createdAt',
	updatedAt: 'updatedAt'
}

exports.Prisma.TokenScalarFieldEnum = {
	id: 'id',
	token: 'token',
	type: 'type',
	accountId: 'accountId',
	expiresIn: 'expiresIn',
	createdAt: 'createdAt',
	updatedAt: 'updatedAt'
}

exports.Prisma.NotificationScalarFieldEnum = {
	id: 'id',
	title: 'title',
	message: 'message',
	link: 'link',
	type: 'type',
	isRead: 'isRead',
	accountId: 'accountId',
	createdAt: 'createdAt',
	updatedAt: 'updatedAt'
}

exports.Prisma.SupportMessageScalarFieldEnum = {
	id: 'id',
	message: 'message',
	senderId: 'senderId',
	receiverId: 'receiverId',
	createdAt: 'createdAt',
	updatedAt: 'updatedAt'
}

exports.Prisma.LoyaltyLevelScalarFieldEnum = {
	id: 'id',
	name: 'name',
	minPoints: 'minPoints',
	bonusPercentage: 'bonusPercentage',
	hasPriorityDelivery: 'hasPriorityDelivery',
	hasPersonalManager: 'hasPersonalManager',
	hasExclusiveAccess: 'hasExclusiveAccess',
	additionalBenefits: 'additionalBenefits',
	createdAt: 'createdAt',
	updatedAt: 'updatedAt'
}

exports.Prisma.AccountLoyaltyScalarFieldEnum = {
	id: 'id',
	accountId: 'accountId',
	loyaltyLevelId: 'loyaltyLevelId',
	points: 'points',
	totalSpent: 'totalSpent',
	ordersCount: 'ordersCount',
	lastActivity: 'lastActivity',
	achievements: 'achievements',
	createdAt: 'createdAt',
	updatedAt: 'updatedAt'
}

exports.Prisma.LoyaltyTransactionScalarFieldEnum = {
	id: 'id',
	accountLoyaltyId: 'accountLoyaltyId',
	points: 'points',
	type: 'type',
	orderId: 'orderId',
	description: 'description',
	metadata: 'metadata',
	createdAt: 'createdAt'
}

exports.Prisma.SortOrder = {
	asc: 'asc',
	desc: 'desc'
}

exports.Prisma.NullableJsonNullValueInput = {
	DbNull: Prisma.DbNull,
	JsonNull: Prisma.JsonNull
}

exports.Prisma.QueryMode = {
	default: 'default',
	insensitive: 'insensitive'
}

exports.Prisma.NullsOrder = {
	first: 'first',
	last: 'last'
}

exports.Prisma.JsonNullValueFilter = {
	DbNull: Prisma.DbNull,
	JsonNull: Prisma.JsonNull,
	AnyNull: Prisma.AnyNull
}
exports.LoyaltyTransactionType = exports.$Enums.LoyaltyTransactionType = {
	REVIEW: 'REVIEW',
	REFERRAL: 'REFERRAL',
	BIRTHDAY: 'BIRTHDAY',
	PURCHASE: 'PURCHASE'
}

exports.OrderStatus = exports.$Enums.OrderStatus = {
	WAITING_FOR_PAYMENT: 'WAITING_FOR_PAYMENT',
	PAYED: 'PAYED',
	PROCESSING: 'PROCESSING',
	READY_FOR_DELIVERY: 'READY_FOR_DELIVERY',
	DELIVERING: 'DELIVERING',
	COMPLETED: 'COMPLETED',
	CANCELED: 'CANCELED',
	RETURNED: 'RETURNED'
}

exports.NotificationType = exports.$Enums.NotificationType = {
	ORDER: 'ORDER',
	REVIEW: 'REVIEW',
	ACCOUNT: 'ACCOUNT'
}

exports.RoleName = exports.$Enums.RoleName = {
	REGULAR: 'REGULAR',
	ADMIN: 'ADMIN',
	SUPER_ADMIN: 'SUPER_ADMIN',
	MANAGER: 'MANAGER',
	SUPPORT: 'SUPPORT',
	EDITOR: 'EDITOR'
}

exports.TokenTypes = exports.$Enums.TokenTypes = {
	RESET_PASSWORD: 'RESET_PASSWORD',
	VERIFY_EMAIL: 'VERIFY_EMAIL',
	TWO_FACTOR_EMAIL: 'TWO_FACTOR_EMAIL',
	TWO_FACTOR_TOTP: 'TWO_FACTOR_TOTP',
	TELEGRAM_AUTH: 'TELEGRAM_AUTH'
}

exports.PaymentMethod = exports.$Enums.PaymentMethod = {
	CARD: 'CARD',
	CASH: 'CASH',
	ONLINE_WALLET: 'ONLINE_WALLET',
	BANK_TRANSFER: 'BANK_TRANSFER'
}

exports.PaymentStatus = exports.$Enums.PaymentStatus = {
	PENDING: 'PENDING',
	COMPLETED: 'COMPLETED',
	FAILED: 'FAILED',
	REFUNDED: 'REFUNDED'
}

exports.DeliveryType = exports.$Enums.DeliveryType = {
	COURIER: 'COURIER',
	PICKUP: 'PICKUP',
	EXPRESS: 'EXPRESS'
}

exports.Prisma.ModelName = {
	Role: 'Role',
	AccountRole: 'AccountRole',
	Cart: 'Cart',
	Category: 'Category',
	Ingredient: 'Ingredient',
	ProductIngredients: 'ProductIngredients',
	Product: 'Product',
	Favorite: 'Favorite',
	AccountSettings: 'AccountSettings',
	Account: 'Account',
	DeliveryAddress: 'DeliveryAddress',
	Order: 'Order',
	OrderItem: 'OrderItem',
	ProductComment: 'ProductComment',
	Post: 'Post',
	PostComment: 'PostComment',
	PostLike: 'PostLike',
	Token: 'Token',
	Notification: 'Notification',
	SupportMessage: 'SupportMessage',
	LoyaltyLevel: 'LoyaltyLevel',
	AccountLoyalty: 'AccountLoyalty',
	LoyaltyTransaction: 'LoyaltyTransaction'
}
/**
 * Create the Client
 */
const config = {
	generator: {
		name: 'client',
		provider: {
			fromEnvVar: null,
			value: 'prisma-client-js'
		},
		output: {
			value: 'C:\\Users\\danya\\Desktop\\backend\\prisma\\generated',
			fromEnvVar: null
		},
		config: {
			engineType: 'library'
		},
		binaryTargets: [
			{
				fromEnvVar: null,
				value: 'windows',
				native: true
			}
		],
		previewFeatures: [],
		sourceFilePath: 'C:\\Users\\danya\\Desktop\\backend\\prisma\\schema.prisma',
		isCustomOutput: true
	},
	relativeEnvPaths: {
		rootEnvPath: null,
		schemaEnvPath: '../../.env'
	},
	relativePath: '..',
	clientVersion: '6.5.0',
	engineVersion: '4123509d24aa4dede1e864b46351bf2790323b69',
	datasourceNames: ['db'],
	activeProvider: 'postgresql',
	inlineDatasources: {
		db: {
			url: {
				fromEnvVar: 'POSTGRES_URI',
				value: null
			}
		}
	},
	inlineSchema:
		'generator client {\n  provider = "prisma-client-js"\n  output   = "./generated"\n}\n\ndatasource db {\n  provider = "postgresql"\n  url      = env("POSTGRES_URI")\n}\n\nmodel Role {\n  id           String        @id @default(cuid())\n  name         RoleName      @unique\n  accountRoles AccountRole[]\n\n  @@map("roles")\n}\n\nmodel AccountRole {\n  id String @id @default(cuid())\n\n  accountId String @map("account_id")\n  roleId    String @map("role_id")\n\n  account Account @relation(fields: [accountId], references: [id], onDelete: Cascade)\n  role    Role    @relation(fields: [roleId], references: [id], onDelete: Cascade)\n\n  createdAt DateTime @default(now()) @map("created_at")\n  updatedAt DateTime @updatedAt @map("updated_at")\n\n  @@map("account_roles")\n}\n\nmodel Cart {\n  id String @id @default(cuid())\n\n  accountId String  @map("account_id")\n  account   Account @relation(fields: [accountId], references: [id], onDelete: Cascade)\n\n  productId String  @map("product_id")\n  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)\n\n  quantity Int @default(1)\n\n  createdAt DateTime @default(now()) @map("created_at")\n  updatedAt DateTime @updatedAt @map("updated_at")\n\n  @@map("carts")\n}\n\nmodel Category {\n  id       String  @id @default(cuid())\n  title    String  @unique\n  imageUrl String?\n\n  createdAt DateTime  @default(now()) @map("created_at")\n  updatedAt DateTime  @updatedAt @map("updated_at")\n  products  Product[]\n\n  @@map("categories")\n}\n\nmodel Ingredient {\n  id       String  @id @default(cuid())\n  title    String  @unique\n  imageUrl String?\n\n  createdAt          DateTime             @default(now()) @map("created_at")\n  updatedAt          DateTime             @updatedAt @map("updated_at")\n  productIngredients ProductIngredients[]\n\n  @@map("ingredients")\n}\n\nmodel ProductIngredients {\n  id           String     @id @default(cuid())\n  productId    String     @map("product_id")\n  product      Product    @relation(fields: [productId], references: [id], onDelete: Cascade)\n  ingredientId String     @map("ingredient_id")\n  ingredient   Ingredient @relation(fields: [ingredientId], references: [id], onDelete: Cascade)\n\n  createdAt DateTime @default(now()) @map("created_at")\n  updatedAt DateTime @updatedAt @map("updated_at")\n\n  @@map("product_ingredients")\n}\n\nmodel Product {\n  id          String   @id @default(cuid())\n  title       String\n  description String?\n  weight      Float    @default(0)\n  imageUrl    String?  @map("image_url")\n  price       Float    @default(0)\n  onSale      Boolean  @default(true)\n  categoryId  String   @map("category_id")\n  category    Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)\n\n  createdAt   DateTime             @default(now()) @map("created_at")\n  updatedAt   DateTime             @updatedAt @map("updated_at")\n  cart        Cart[]\n  favorite    Favorite[]\n  ingredients ProductIngredients[]\n  orderItem   OrderItem[]\n  comments    ProductComment[]\n\n  @@index([categoryId])\n  @@index([onSale])\n  @@map("products")\n}\n\nmodel Favorite {\n  id        String  @id @default(cuid())\n  productId String  @map("product_id")\n  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)\n\n  accountId String  @map("account_id")\n  account   Account @relation(fields: [accountId], references: [id], onDelete: Cascade)\n\n  createdAt DateTime @default(now()) @map("created_at")\n  updatedAt DateTime @updatedAt @map("updated_at")\n\n  @@unique([accountId, productId])\n  @@map("favorites")\n}\n\nmodel AccountSettings {\n  id String @id @default(cuid())\n\n  accountId String  @unique @map("account_id")\n  account   Account @relation(fields: [accountId], references: [id], onDelete: Cascade)\n\n  telegramId String? @unique\n\n  isVerifiedEmail Boolean @default(false) @map("is_verified_email")\n\n  isTwoFactorEmailEnabled Boolean @default(false) @map("is_two_factor_email_enabled")\n\n  isTwoFactorTotpEnabled Boolean @default(false) @map("is_two_factor_totp_enabled")\n\n  totpSecret String? @map("totp_secret")\n\n  siteNotification     Boolean @default(true) @map("site_notification")\n  telegramNotification Boolean @default(false) @map("telegram_notification")\n\n  @@map("account_settings")\n}\n\nmodel Account {\n  id String @id @default(cuid())\n\n  email    String @unique\n  password String\n\n  userName String @unique\n\n  picture String?\n\n  createdAt DateTime @default(now()) @map("created_at")\n  updatedAt DateTime @updatedAt @map("updated_at")\n\n  roles            AccountRole[]\n  cart             Cart[]\n  favorites        Favorite[]\n  orders           Order[]\n  productComments  ProductComment[]\n  deliveryAdresses DeliveryAddress[]\n  notifications    Notification[]\n  posts            Post[]\n  postComments     PostComment[]\n  postLikes        PostLike[]\n  tokens           Token[]\n  accountSettings  AccountSettings?\n  accountLoyalty   AccountLoyalty?\n\n  sentMessages     SupportMessage[] @relation("SenderRelation")\n  receivedMessages SupportMessage[] @relation("ReceiverRelation")\n\n  @@index([email])\n  @@map("accounts")\n}\n\nmodel DeliveryAddress {\n  id        String  @id @default(cuid())\n  accountId String  @map("account_id")\n  account   Account @relation(fields: [accountId], references: [id], onDelete: Cascade)\n  city      String\n  street    String\n  house     String\n  flat      String\n\n  createdAt DateTime @default(now()) @map("created_at")\n  updatedAt DateTime @updatedAt @map("updated_at")\n\n  @@map("delivery_addresses")\n}\n\nmodel Order {\n  id String @id @default(cuid())\n\n  status OrderStatus @default(WAITING_FOR_PAYMENT)\n\n  firstName         String  @map("first_name")\n  lastName          String  @map("last_name")\n  phone             String\n  email             String? @map("email")\n  deliveryAddressId String? @map("delivery_address_id")\n\n  deliveryAddress Json?\n\n  deliveryType DeliveryType @map("delivery_type")\n\n  paymentMethod PaymentMethod @map("payment_method")\n\n  paymentStatus PaymentStatus @map("payment_status")\n\n  comment String?\n\n  items OrderItem[]\n  total Float\n\n  account   Account? @relation(fields: [accountId], references: [id])\n  accountId String?  @map("account_id")\n\n  createdAt DateTime @default(now()) @map("created_at")\n  updatedAt DateTime @updatedAt @map("updated_at")\n\n  @@index([accountId])\n  @@index([status])\n  @@map("orders")\n}\n\nmodel OrderItem {\n  id      String  @id @default(cuid())\n  order   Order?  @relation(fields: [orderId], references: [id], onDelete: Cascade)\n  orderId String? @map("order_id")\n\n  quantity Int\n  price    Float\n\n  productTitle       String\n  productDescription String?\n  productImageUrl    String?\n\n  productId String  @map("product_id")\n  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)\n\n  createdAt DateTime @default(now()) @map("created_at")\n  updatedAt DateTime @updatedAt @map("updated_at")\n\n  @@map("order_items")\n}\n\nmodel ProductComment {\n  id      String  @id @default(cuid())\n  comment String?\n  rating  Int?\n\n  parentId String?          @map("parent_id")\n  parent   ProductComment?  @relation("CommentReplies", fields: [parentId], references: [id], onDelete: Cascade)\n  replies  ProductComment[] @relation("CommentReplies")\n\n  productId String  @map("product_id")\n  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)\n\n  accountId String  @map("account_id")\n  account   Account @relation(fields: [accountId], references: [id], onDelete: Cascade)\n\n  createdAt DateTime @default(now()) @map("created_at")\n  updatedAt DateTime @updatedAt @map("updated_at")\n\n  @@index([productId])\n  @@index([accountId])\n  @@index([parentId])\n  @@map("product_comments")\n}\n\nmodel Post {\n  id          String  @id @default(cuid())\n  title       String\n  description String?\n  imageUrl    String? @map("image_url")\n  published   Boolean @default(false) @map("published")\n\n  authorId String  @map("author_id")\n  author   Account @relation(fields: [authorId], references: [id], onDelete: Cascade)\n\n  comments PostComment[]\n  likes    PostLike[]\n\n  createdAt DateTime @default(now()) @map("created_at")\n  updatedAt DateTime @updatedAt @map("updated_at")\n\n  @@index([authorId])\n  @@index([published])\n  @@map("posts")\n}\n\nmodel PostComment {\n  id      String @id @default(cuid())\n  comment String\n\n  authorId String  @map("author_id")\n  author   Account @relation(fields: [authorId], references: [id], onDelete: Cascade)\n\n  postId String @map("post_id")\n  post   Post   @relation(fields: [postId], references: [id], onDelete: Cascade)\n\n  createdAt DateTime @default(now()) @map("created_at")\n  updatedAt DateTime @updatedAt @map("updated_at")\n\n  @@index([postId])\n  @@index([authorId])\n  @@map("post_comments")\n}\n\nmodel PostLike {\n  id     String @id @default(cuid())\n  postId String @map("post_id")\n  post   Post   @relation(fields: [postId], references: [id], onDelete: Cascade)\n\n  accountId String  @map("account_id")\n  account   Account @relation(fields: [accountId], references: [id], onDelete: Cascade)\n\n  createdAt DateTime @default(now()) @map("created_at")\n  updatedAt DateTime @updatedAt @map("updated_at")\n\n  @@unique([postId, accountId])\n  @@map("post_likes")\n}\n\nmodel Token {\n  id        String     @id @default(cuid())\n  token     String     @unique\n  type      TokenTypes\n  accountId String\n  account   Account?   @relation(fields: [accountId], references: [id], onDelete: Cascade)\n  expiresIn DateTime\n  createdAt DateTime   @default(now()) @map("created_at")\n  updatedAt DateTime   @updatedAt @map("updated_at")\n\n  @@map("tokens")\n}\n\nmodel Notification {\n  id        String           @id @default(cuid())\n  title     String\n  message   String\n  link      String\n  type      NotificationType\n  isRead    Boolean          @default(false)\n  accountId String           @map("account_id")\n  account   Account?         @relation(fields: [accountId], references: [id], onDelete: Cascade)\n\n  createdAt DateTime @default(now()) @map("created_at")\n  updatedAt DateTime @updatedAt @map("updated_at")\n\n  @@map("notifications")\n}\n\nmodel SupportMessage {\n  id      String @id @default(uuid())\n  message String\n\n  senderId   String\n  receiverId String\n\n  sender   Account @relation("SenderRelation", fields: [senderId], references: [id])\n  receiver Account @relation("ReceiverRelation", fields: [receiverId], references: [id])\n\n  createdAt DateTime @default(now()) @map("created_at")\n  updatedAt DateTime @updatedAt @map("updated_at")\n\n  @@map("support_messages")\n}\n\nmodel LoyaltyLevel {\n  id                  String           @id @default(uuid())\n  name                String\n  minPoints           Int\n  bonusPercentage     Float\n  hasPriorityDelivery Boolean          @default(false)\n  hasPersonalManager  Boolean          @default(false)\n  hasExclusiveAccess  Boolean          @default(false)\n  additionalBenefits  Json?\n  accountLoyalties    AccountLoyalty[]\n  createdAt           DateTime         @default(now())\n  updatedAt           DateTime         @updatedAt\n}\n\nmodel AccountLoyalty {\n  id             String               @id @default(uuid())\n  accountId      String               @unique\n  account        Account              @relation(fields: [accountId], references: [id], onDelete: Cascade)\n  loyaltyLevelId String\n  loyaltyLevel   LoyaltyLevel         @relation(fields: [loyaltyLevelId], references: [id])\n  points         Int\n  totalSpent     Float                @default(0)\n  ordersCount    Int                  @default(0)\n  lastActivity   DateTime             @default(now())\n  achievements   Json?\n  transactions   LoyaltyTransaction[]\n  createdAt      DateTime             @default(now())\n  updatedAt      DateTime             @updatedAt\n\n  @@map("account_loyalty")\n}\n\nmodel LoyaltyTransaction {\n  id               String                 @id @default(uuid())\n  accountLoyaltyId String\n  accountLoyalty   AccountLoyalty         @relation(fields: [accountLoyaltyId], references: [id])\n  points           Int\n  type             LoyaltyTransactionType // purchase, review, referral, birthday, achievement\n  orderId          String?\n  description      String?\n  metadata         Json?\n  createdAt        DateTime               @default(now())\n\n  @@map("loyalty_transactions")\n}\n\nenum LoyaltyTransactionType {\n  REVIEW\n  REFERRAL\n  BIRTHDAY\n  PURCHASE\n}\n\nenum OrderStatus {\n  WAITING_FOR_PAYMENT // Ожидает оплаты\n  PAYED // Оплачен\n  PROCESSING // В обработке\n  READY_FOR_DELIVERY // Готов к доставке\n  DELIVERING // Доставляется\n  COMPLETED // Выполнен\n  CANCELED // Отменен\n  RETURNED // Возвращен\n}\n\nenum NotificationType {\n  ORDER\n  REVIEW\n  ACCOUNT\n}\n\nenum RoleName {\n  REGULAR\n  ADMIN\n  SUPER_ADMIN\n  MANAGER\n  SUPPORT\n  EDITOR\n}\n\nenum TokenTypes {\n  RESET_PASSWORD\n  VERIFY_EMAIL\n  TWO_FACTOR_EMAIL\n  TWO_FACTOR_TOTP\n  TELEGRAM_AUTH\n}\n\nenum PaymentMethod {\n  CARD\n  CASH\n  ONLINE_WALLET\n  BANK_TRANSFER\n}\n\nenum PaymentStatus {\n  PENDING\n  COMPLETED\n  FAILED\n  REFUNDED\n}\n\nenum DeliveryType {\n  COURIER\n  PICKUP\n  EXPRESS\n}\n',
	inlineSchemaHash: '55e1f38df2acf4b56d708195d3ade4c9618e9eb2b66b22f228fe6ef01b40fa10',
	copyEngine: true
}
config.dirname = '/'

config.runtimeDataModel = JSON.parse(
	'{"models":{"Role":{"dbName":"roles","schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":null,"default":{"name":"cuid","args":[1]},"isGenerated":false,"isUpdatedAt":false},{"name":"name","kind":"enum","isList":false,"isRequired":true,"isUnique":true,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"RoleName","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"accountRoles","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"AccountRole","nativeType":null,"relationName":"AccountRoleToRole","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"AccountRole":{"dbName":"account_roles","schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":null,"default":{"name":"cuid","args":[1]},"isGenerated":false,"isUpdatedAt":false},{"name":"accountId","dbName":"account_id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"roleId","dbName":"role_id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"account","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Account","nativeType":null,"relationName":"AccountToAccountRole","relationFromFields":["accountId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"role","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Role","nativeType":null,"relationName":"AccountRoleToRole","relationFromFields":["roleId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","dbName":"created_at","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":null,"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","dbName":"updated_at","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":null,"isGenerated":false,"isUpdatedAt":true}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"Cart":{"dbName":"carts","schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":null,"default":{"name":"cuid","args":[1]},"isGenerated":false,"isUpdatedAt":false},{"name":"accountId","dbName":"account_id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"account","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Account","nativeType":null,"relationName":"AccountToCart","relationFromFields":["accountId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"productId","dbName":"product_id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"product","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Product","nativeType":null,"relationName":"CartToProduct","relationFromFields":["productId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"quantity","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Int","nativeType":null,"default":1,"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","dbName":"created_at","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":null,"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","dbName":"updated_at","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":null,"isGenerated":false,"isUpdatedAt":true}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"Category":{"dbName":"categories","schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":null,"default":{"name":"cuid","args":[1]},"isGenerated":false,"isUpdatedAt":false},{"name":"title","kind":"scalar","isList":false,"isRequired":true,"isUnique":true,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"imageUrl","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","dbName":"created_at","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":null,"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","dbName":"updated_at","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":null,"isGenerated":false,"isUpdatedAt":true},{"name":"products","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Product","nativeType":null,"relationName":"CategoryToProduct","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"Ingredient":{"dbName":"ingredients","schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":null,"default":{"name":"cuid","args":[1]},"isGenerated":false,"isUpdatedAt":false},{"name":"title","kind":"scalar","isList":false,"isRequired":true,"isUnique":true,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"imageUrl","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","dbName":"created_at","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":null,"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","dbName":"updated_at","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":null,"isGenerated":false,"isUpdatedAt":true},{"name":"productIngredients","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"ProductIngredients","nativeType":null,"relationName":"IngredientToProductIngredients","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"ProductIngredients":{"dbName":"product_ingredients","schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":null,"default":{"name":"cuid","args":[1]},"isGenerated":false,"isUpdatedAt":false},{"name":"productId","dbName":"product_id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"product","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Product","nativeType":null,"relationName":"ProductToProductIngredients","relationFromFields":["productId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"ingredientId","dbName":"ingredient_id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"ingredient","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Ingredient","nativeType":null,"relationName":"IngredientToProductIngredients","relationFromFields":["ingredientId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","dbName":"created_at","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":null,"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","dbName":"updated_at","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":null,"isGenerated":false,"isUpdatedAt":true}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"Product":{"dbName":"products","schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":null,"default":{"name":"cuid","args":[1]},"isGenerated":false,"isUpdatedAt":false},{"name":"title","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"description","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"weight","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Float","nativeType":null,"default":0,"isGenerated":false,"isUpdatedAt":false},{"name":"imageUrl","dbName":"image_url","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"price","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Float","nativeType":null,"default":0,"isGenerated":false,"isUpdatedAt":false},{"name":"onSale","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Boolean","nativeType":null,"default":true,"isGenerated":false,"isUpdatedAt":false},{"name":"categoryId","dbName":"category_id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"category","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Category","nativeType":null,"relationName":"CategoryToProduct","relationFromFields":["categoryId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","dbName":"created_at","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":null,"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","dbName":"updated_at","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":null,"isGenerated":false,"isUpdatedAt":true},{"name":"cart","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Cart","nativeType":null,"relationName":"CartToProduct","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"favorite","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Favorite","nativeType":null,"relationName":"FavoriteToProduct","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"ingredients","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"ProductIngredients","nativeType":null,"relationName":"ProductToProductIngredients","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"orderItem","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"OrderItem","nativeType":null,"relationName":"OrderItemToProduct","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"comments","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"ProductComment","nativeType":null,"relationName":"ProductToProductComment","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"Favorite":{"dbName":"favorites","schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":null,"default":{"name":"cuid","args":[1]},"isGenerated":false,"isUpdatedAt":false},{"name":"productId","dbName":"product_id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"product","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Product","nativeType":null,"relationName":"FavoriteToProduct","relationFromFields":["productId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"accountId","dbName":"account_id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"account","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Account","nativeType":null,"relationName":"AccountToFavorite","relationFromFields":["accountId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","dbName":"created_at","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":null,"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","dbName":"updated_at","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":null,"isGenerated":false,"isUpdatedAt":true}],"primaryKey":null,"uniqueFields":[["accountId","productId"]],"uniqueIndexes":[{"name":null,"fields":["accountId","productId"]}],"isGenerated":false},"AccountSettings":{"dbName":"account_settings","schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":null,"default":{"name":"cuid","args":[1]},"isGenerated":false,"isUpdatedAt":false},{"name":"accountId","dbName":"account_id","kind":"scalar","isList":false,"isRequired":true,"isUnique":true,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"account","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Account","nativeType":null,"relationName":"AccountToAccountSettings","relationFromFields":["accountId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"telegramId","kind":"scalar","isList":false,"isRequired":false,"isUnique":true,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"isVerifiedEmail","dbName":"is_verified_email","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Boolean","nativeType":null,"default":false,"isGenerated":false,"isUpdatedAt":false},{"name":"isTwoFactorEmailEnabled","dbName":"is_two_factor_email_enabled","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Boolean","nativeType":null,"default":false,"isGenerated":false,"isUpdatedAt":false},{"name":"isTwoFactorTotpEnabled","dbName":"is_two_factor_totp_enabled","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Boolean","nativeType":null,"default":false,"isGenerated":false,"isUpdatedAt":false},{"name":"totpSecret","dbName":"totp_secret","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"siteNotification","dbName":"site_notification","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Boolean","nativeType":null,"default":true,"isGenerated":false,"isUpdatedAt":false},{"name":"telegramNotification","dbName":"telegram_notification","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Boolean","nativeType":null,"default":false,"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"Account":{"dbName":"accounts","schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":null,"default":{"name":"cuid","args":[1]},"isGenerated":false,"isUpdatedAt":false},{"name":"email","kind":"scalar","isList":false,"isRequired":true,"isUnique":true,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"password","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"userName","kind":"scalar","isList":false,"isRequired":true,"isUnique":true,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"picture","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","dbName":"created_at","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":null,"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","dbName":"updated_at","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":null,"isGenerated":false,"isUpdatedAt":true},{"name":"roles","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"AccountRole","nativeType":null,"relationName":"AccountToAccountRole","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"cart","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Cart","nativeType":null,"relationName":"AccountToCart","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"favorites","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Favorite","nativeType":null,"relationName":"AccountToFavorite","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"orders","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Order","nativeType":null,"relationName":"AccountToOrder","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"productComments","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"ProductComment","nativeType":null,"relationName":"AccountToProductComment","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"deliveryAdresses","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DeliveryAddress","nativeType":null,"relationName":"AccountToDeliveryAddress","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"notifications","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Notification","nativeType":null,"relationName":"AccountToNotification","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"posts","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Post","nativeType":null,"relationName":"AccountToPost","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"postComments","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"PostComment","nativeType":null,"relationName":"AccountToPostComment","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"postLikes","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"PostLike","nativeType":null,"relationName":"AccountToPostLike","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"tokens","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Token","nativeType":null,"relationName":"AccountToToken","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"accountSettings","kind":"object","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"AccountSettings","nativeType":null,"relationName":"AccountToAccountSettings","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"accountLoyalty","kind":"object","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"AccountLoyalty","nativeType":null,"relationName":"AccountToAccountLoyalty","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"sentMessages","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"SupportMessage","nativeType":null,"relationName":"SenderRelation","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"receivedMessages","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"SupportMessage","nativeType":null,"relationName":"ReceiverRelation","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"DeliveryAddress":{"dbName":"delivery_addresses","schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":null,"default":{"name":"cuid","args":[1]},"isGenerated":false,"isUpdatedAt":false},{"name":"accountId","dbName":"account_id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"account","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Account","nativeType":null,"relationName":"AccountToDeliveryAddress","relationFromFields":["accountId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"city","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"street","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"house","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"flat","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","dbName":"created_at","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":null,"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","dbName":"updated_at","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":null,"isGenerated":false,"isUpdatedAt":true}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"Order":{"dbName":"orders","schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":null,"default":{"name":"cuid","args":[1]},"isGenerated":false,"isUpdatedAt":false},{"name":"status","kind":"enum","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"OrderStatus","nativeType":null,"default":"WAITING_FOR_PAYMENT","isGenerated":false,"isUpdatedAt":false},{"name":"firstName","dbName":"first_name","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"lastName","dbName":"last_name","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"phone","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"email","dbName":"email","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"deliveryAddressId","dbName":"delivery_address_id","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"deliveryAddress","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Json","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"deliveryType","dbName":"delivery_type","kind":"enum","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DeliveryType","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"paymentMethod","dbName":"payment_method","kind":"enum","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"PaymentMethod","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"paymentStatus","dbName":"payment_status","kind":"enum","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"PaymentStatus","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"comment","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"items","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"OrderItem","nativeType":null,"relationName":"OrderToOrderItem","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"total","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Float","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"account","kind":"object","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Account","nativeType":null,"relationName":"AccountToOrder","relationFromFields":["accountId"],"relationToFields":["id"],"isGenerated":false,"isUpdatedAt":false},{"name":"accountId","dbName":"account_id","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","dbName":"created_at","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":null,"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","dbName":"updated_at","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":null,"isGenerated":false,"isUpdatedAt":true}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"OrderItem":{"dbName":"order_items","schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":null,"default":{"name":"cuid","args":[1]},"isGenerated":false,"isUpdatedAt":false},{"name":"order","kind":"object","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Order","nativeType":null,"relationName":"OrderToOrderItem","relationFromFields":["orderId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"orderId","dbName":"order_id","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"quantity","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Int","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"price","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Float","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"productTitle","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"productDescription","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"productImageUrl","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"productId","dbName":"product_id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"product","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Product","nativeType":null,"relationName":"OrderItemToProduct","relationFromFields":["productId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","dbName":"created_at","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":null,"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","dbName":"updated_at","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":null,"isGenerated":false,"isUpdatedAt":true}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"ProductComment":{"dbName":"product_comments","schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":null,"default":{"name":"cuid","args":[1]},"isGenerated":false,"isUpdatedAt":false},{"name":"comment","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"rating","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Int","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"parentId","dbName":"parent_id","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"parent","kind":"object","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"ProductComment","nativeType":null,"relationName":"CommentReplies","relationFromFields":["parentId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"replies","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"ProductComment","nativeType":null,"relationName":"CommentReplies","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"productId","dbName":"product_id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"product","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Product","nativeType":null,"relationName":"ProductToProductComment","relationFromFields":["productId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"accountId","dbName":"account_id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"account","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Account","nativeType":null,"relationName":"AccountToProductComment","relationFromFields":["accountId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","dbName":"created_at","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":null,"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","dbName":"updated_at","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":null,"isGenerated":false,"isUpdatedAt":true}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"Post":{"dbName":"posts","schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":null,"default":{"name":"cuid","args":[1]},"isGenerated":false,"isUpdatedAt":false},{"name":"title","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"description","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"imageUrl","dbName":"image_url","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"published","dbName":"published","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Boolean","nativeType":null,"default":false,"isGenerated":false,"isUpdatedAt":false},{"name":"authorId","dbName":"author_id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"author","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Account","nativeType":null,"relationName":"AccountToPost","relationFromFields":["authorId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"comments","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"PostComment","nativeType":null,"relationName":"PostToPostComment","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"likes","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"PostLike","nativeType":null,"relationName":"PostToPostLike","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","dbName":"created_at","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":null,"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","dbName":"updated_at","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":null,"isGenerated":false,"isUpdatedAt":true}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"PostComment":{"dbName":"post_comments","schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":null,"default":{"name":"cuid","args":[1]},"isGenerated":false,"isUpdatedAt":false},{"name":"comment","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"authorId","dbName":"author_id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"author","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Account","nativeType":null,"relationName":"AccountToPostComment","relationFromFields":["authorId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"postId","dbName":"post_id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"post","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Post","nativeType":null,"relationName":"PostToPostComment","relationFromFields":["postId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","dbName":"created_at","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":null,"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","dbName":"updated_at","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":null,"isGenerated":false,"isUpdatedAt":true}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"PostLike":{"dbName":"post_likes","schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":null,"default":{"name":"cuid","args":[1]},"isGenerated":false,"isUpdatedAt":false},{"name":"postId","dbName":"post_id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"post","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Post","nativeType":null,"relationName":"PostToPostLike","relationFromFields":["postId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"accountId","dbName":"account_id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"account","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Account","nativeType":null,"relationName":"AccountToPostLike","relationFromFields":["accountId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","dbName":"created_at","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":null,"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","dbName":"updated_at","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":null,"isGenerated":false,"isUpdatedAt":true}],"primaryKey":null,"uniqueFields":[["postId","accountId"]],"uniqueIndexes":[{"name":null,"fields":["postId","accountId"]}],"isGenerated":false},"Token":{"dbName":"tokens","schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":null,"default":{"name":"cuid","args":[1]},"isGenerated":false,"isUpdatedAt":false},{"name":"token","kind":"scalar","isList":false,"isRequired":true,"isUnique":true,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"type","kind":"enum","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"TokenTypes","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"accountId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"account","kind":"object","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Account","nativeType":null,"relationName":"AccountToToken","relationFromFields":["accountId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"expiresIn","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","dbName":"created_at","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":null,"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","dbName":"updated_at","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":null,"isGenerated":false,"isUpdatedAt":true}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"Notification":{"dbName":"notifications","schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":null,"default":{"name":"cuid","args":[1]},"isGenerated":false,"isUpdatedAt":false},{"name":"title","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"message","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"link","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"type","kind":"enum","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"NotificationType","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"isRead","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Boolean","nativeType":null,"default":false,"isGenerated":false,"isUpdatedAt":false},{"name":"accountId","dbName":"account_id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"account","kind":"object","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Account","nativeType":null,"relationName":"AccountToNotification","relationFromFields":["accountId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","dbName":"created_at","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":null,"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","dbName":"updated_at","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":null,"isGenerated":false,"isUpdatedAt":true}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"SupportMessage":{"dbName":"support_messages","schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":null,"default":{"name":"uuid","args":[4]},"isGenerated":false,"isUpdatedAt":false},{"name":"message","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"senderId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"receiverId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"sender","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Account","nativeType":null,"relationName":"SenderRelation","relationFromFields":["senderId"],"relationToFields":["id"],"isGenerated":false,"isUpdatedAt":false},{"name":"receiver","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Account","nativeType":null,"relationName":"ReceiverRelation","relationFromFields":["receiverId"],"relationToFields":["id"],"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","dbName":"created_at","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":null,"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","dbName":"updated_at","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":null,"isGenerated":false,"isUpdatedAt":true}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"LoyaltyLevel":{"dbName":null,"schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":null,"default":{"name":"uuid","args":[4]},"isGenerated":false,"isUpdatedAt":false},{"name":"name","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"minPoints","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Int","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"bonusPercentage","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Float","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"hasPriorityDelivery","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Boolean","nativeType":null,"default":false,"isGenerated":false,"isUpdatedAt":false},{"name":"hasPersonalManager","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Boolean","nativeType":null,"default":false,"isGenerated":false,"isUpdatedAt":false},{"name":"hasExclusiveAccess","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Boolean","nativeType":null,"default":false,"isGenerated":false,"isUpdatedAt":false},{"name":"additionalBenefits","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Json","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"accountLoyalties","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"AccountLoyalty","nativeType":null,"relationName":"AccountLoyaltyToLoyaltyLevel","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":null,"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":null,"isGenerated":false,"isUpdatedAt":true}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"AccountLoyalty":{"dbName":"account_loyalty","schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":null,"default":{"name":"uuid","args":[4]},"isGenerated":false,"isUpdatedAt":false},{"name":"accountId","kind":"scalar","isList":false,"isRequired":true,"isUnique":true,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"account","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Account","nativeType":null,"relationName":"AccountToAccountLoyalty","relationFromFields":["accountId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"loyaltyLevelId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"loyaltyLevel","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"LoyaltyLevel","nativeType":null,"relationName":"AccountLoyaltyToLoyaltyLevel","relationFromFields":["loyaltyLevelId"],"relationToFields":["id"],"isGenerated":false,"isUpdatedAt":false},{"name":"points","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Int","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"totalSpent","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Float","nativeType":null,"default":0,"isGenerated":false,"isUpdatedAt":false},{"name":"ordersCount","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Int","nativeType":null,"default":0,"isGenerated":false,"isUpdatedAt":false},{"name":"lastActivity","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":null,"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"achievements","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Json","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"transactions","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"LoyaltyTransaction","nativeType":null,"relationName":"AccountLoyaltyToLoyaltyTransaction","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":null,"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":null,"isGenerated":false,"isUpdatedAt":true}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"LoyaltyTransaction":{"dbName":"loyalty_transactions","schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":null,"default":{"name":"uuid","args":[4]},"isGenerated":false,"isUpdatedAt":false},{"name":"accountLoyaltyId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"accountLoyalty","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"AccountLoyalty","nativeType":null,"relationName":"AccountLoyaltyToLoyaltyTransaction","relationFromFields":["accountLoyaltyId"],"relationToFields":["id"],"isGenerated":false,"isUpdatedAt":false},{"name":"points","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Int","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"type","kind":"enum","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"LoyaltyTransactionType","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"orderId","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"description","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"metadata","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Json","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":null,"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false}},"enums":{"LoyaltyTransactionType":{"values":[{"name":"REVIEW","dbName":null},{"name":"REFERRAL","dbName":null},{"name":"BIRTHDAY","dbName":null},{"name":"PURCHASE","dbName":null}],"dbName":null},"OrderStatus":{"values":[{"name":"WAITING_FOR_PAYMENT","dbName":null},{"name":"PAYED","dbName":null},{"name":"PROCESSING","dbName":null},{"name":"READY_FOR_DELIVERY","dbName":null},{"name":"DELIVERING","dbName":null},{"name":"COMPLETED","dbName":null},{"name":"CANCELED","dbName":null},{"name":"RETURNED","dbName":null}],"dbName":null},"NotificationType":{"values":[{"name":"ORDER","dbName":null},{"name":"REVIEW","dbName":null},{"name":"ACCOUNT","dbName":null}],"dbName":null},"RoleName":{"values":[{"name":"REGULAR","dbName":null},{"name":"ADMIN","dbName":null},{"name":"SUPER_ADMIN","dbName":null},{"name":"MANAGER","dbName":null},{"name":"SUPPORT","dbName":null},{"name":"EDITOR","dbName":null}],"dbName":null},"TokenTypes":{"values":[{"name":"RESET_PASSWORD","dbName":null},{"name":"VERIFY_EMAIL","dbName":null},{"name":"TWO_FACTOR_EMAIL","dbName":null},{"name":"TWO_FACTOR_TOTP","dbName":null},{"name":"TELEGRAM_AUTH","dbName":null}],"dbName":null},"PaymentMethod":{"values":[{"name":"CARD","dbName":null},{"name":"CASH","dbName":null},{"name":"ONLINE_WALLET","dbName":null},{"name":"BANK_TRANSFER","dbName":null}],"dbName":null},"PaymentStatus":{"values":[{"name":"PENDING","dbName":null},{"name":"COMPLETED","dbName":null},{"name":"FAILED","dbName":null},{"name":"REFUNDED","dbName":null}],"dbName":null},"DeliveryType":{"values":[{"name":"COURIER","dbName":null},{"name":"PICKUP","dbName":null},{"name":"EXPRESS","dbName":null}],"dbName":null}},"types":{}}'
)
defineDmmfProperty(exports.Prisma, config.runtimeDataModel)
config.engineWasm = undefined
config.compilerWasm = undefined

config.injectableEdgeEnv = () => ({
	parsed: {
		POSTGRES_URI:
			(typeof globalThis !== 'undefined' && globalThis['POSTGRES_URI']) ||
			(typeof process !== 'undefined' && process.env && process.env.POSTGRES_URI) ||
			undefined
	}
})

if (
	(typeof globalThis !== 'undefined' && globalThis['DEBUG']) ||
	(typeof process !== 'undefined' && process.env && process.env.DEBUG) ||
	undefined
) {
	Debug.enable(
		(typeof globalThis !== 'undefined' && globalThis['DEBUG']) ||
			(typeof process !== 'undefined' && process.env && process.env.DEBUG) ||
			undefined
	)
}

const PrismaClient = getPrismaClient(config)
exports.PrismaClient = PrismaClient
Object.assign(exports, Prisma)
