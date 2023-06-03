-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Movie" (
    "id" SERIAL NOT NULL,
    "movieName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "directorName" TEXT NOT NULL,
    "releaseDate" TIMESTAMP(3) NOT NULL,
    "movieOwnerId" INTEGER NOT NULL,

    CONSTRAINT "Movie_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Movie" ADD CONSTRAINT "Movie_movieOwnerId_fkey" FOREIGN KEY ("movieOwnerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
