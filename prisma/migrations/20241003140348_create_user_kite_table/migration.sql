-- CreateEnum
CREATE TYPE "BrokerType" AS ENUM ('INDIVIDUAL', 'ZERODHA', 'OTHER');

-- CreateEnum
CREATE TYPE "DematConsentType" AS ENUM ('CONSENT', 'NO_CONSENT', 'PHYSICAL');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "avatar" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User_Kite" (
    "id" UUID NOT NULL,
    "kiteId" TEXT NOT NULL,
    "userType" TEXT NOT NULL,
    "broker" "BrokerType" NOT NULL,
    "exchanges" TEXT[],
    "products" TEXT[],
    "orderTypes" TEXT[],
    "email" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "apiKey" TEXT NOT NULL,
    "userShortname" TEXT NOT NULL,
    "accessToken" TEXT,
    "publicToken" TEXT NOT NULL,
    "refreshToken" TEXT,
    "enctoken" TEXT NOT NULL,
    "loginTime" TIMESTAMP(3) NOT NULL,
    "dematConsent" "DematConsentType" NOT NULL,
    "userId" UUID NOT NULL,

    CONSTRAINT "User_Kite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Portfolio" (
    "id" UUID NOT NULL,
    "tradingSymbol" TEXT NOT NULL,
    "exchange" TEXT NOT NULL,
    "instrumentToken" INTEGER NOT NULL,
    "isin" TEXT NOT NULL,
    "product" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "usedQuantity" DOUBLE PRECISION NOT NULL,
    "t1Quantity" DOUBLE PRECISION NOT NULL,
    "realisedQuantity" DOUBLE PRECISION NOT NULL,
    "authorisedQuantity" DOUBLE PRECISION NOT NULL,
    "authorised_date" TIMESTAMP(3) NOT NULL,
    "openingQuantity" DOUBLE PRECISION NOT NULL,
    "collateralQuantity" DOUBLE PRECISION NOT NULL,
    "collateralType" TEXT NOT NULL DEFAULT '',
    "discrepancy" BOOLEAN NOT NULL,
    "average_price" DOUBLE PRECISION NOT NULL,
    "last_price" DOUBLE PRECISION NOT NULL,
    "close_price" DOUBLE PRECISION NOT NULL,
    "pnl" DOUBLE PRECISION NOT NULL,
    "day_change" DOUBLE PRECISION NOT NULL,
    "day_change_percentage" DOUBLE PRECISION NOT NULL,
    "userKiteId" UUID NOT NULL,

    CONSTRAINT "Portfolio_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_createdAt_idx" ON "User"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "User_Kite_kiteId_key" ON "User_Kite"("kiteId");

-- AddForeignKey
ALTER TABLE "User_Kite" ADD CONSTRAINT "User_Kite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Portfolio" ADD CONSTRAINT "Portfolio_userKiteId_fkey" FOREIGN KEY ("userKiteId") REFERENCES "User_Kite"("id") ON DELETE CASCADE ON UPDATE CASCADE;
