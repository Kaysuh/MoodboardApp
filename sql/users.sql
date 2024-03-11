CREATE TABLE "Users" (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email text,
    name text,
    password text
);

ALTER TABLE "public"."Users" ADD CONSTRAINT email_unique UNIQUE ("email");

