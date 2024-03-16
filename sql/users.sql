CREATE TABLE "Users" (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email text,
    username text,
    password text,
    profilePicture text,
    isAdmin boolean DEFAULT false
);
ALTER TABLE "public"."Users" ADD CONSTRAINT email_unique UNIQUE ("email");


