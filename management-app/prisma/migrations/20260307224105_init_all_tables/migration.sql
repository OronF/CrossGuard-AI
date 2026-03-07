-- CreateTable
CREATE TABLE "MessageInfo" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "platform_id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "score" DOUBLE PRECISION NOT NULL,
    "reason_for_deletion" TEXT,
    "group_id" TEXT NOT NULL,

    CONSTRAINT "MessageInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Platform" (
    "id" TEXT NOT NULL,
    "platform_name" TEXT NOT NULL,
    "group_count" INTEGER NOT NULL DEFAULT 0,
    "private_count" INTEGER NOT NULL DEFAULT 0,
    "removed_members" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Platform_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ThresholdParameter" (
    "id" TEXT NOT NULL,
    "threshold" INTEGER NOT NULL,
    "under_threshold" INTEGER NOT NULL,
    "group_id" TEXT NOT NULL,

    CONSTRAINT "ThresholdParameter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "permission_id" TEXT NOT NULL,
    "platform_id" TEXT,
    "group_id" TEXT,
    "members_list_messages" TEXT[],
    "white_list_messages" TEXT[],
    "black_list_messages" TEXT[],

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" TEXT NOT NULL,
    "permission_name" TEXT NOT NULL,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MessageInfo" ADD CONSTRAINT "MessageInfo_platform_id_fkey" FOREIGN KEY ("platform_id") REFERENCES "Platform"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "Permission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_platform_id_fkey" FOREIGN KEY ("platform_id") REFERENCES "Platform"("id") ON DELETE SET NULL ON UPDATE CASCADE;
