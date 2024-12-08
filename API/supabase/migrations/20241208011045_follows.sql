alter table "public"."users" add column "followers" text[];

alter table "public"."users" add column "following" text[];

CREATE UNIQUE INDEX users_followers_key ON public.users USING btree (followers);

CREATE UNIQUE INDEX users_following_key ON public.users USING btree (following);

alter table "public"."users" add constraint "users_followers_key" UNIQUE using index "users_followers_key";

alter table "public"."users" add constraint "users_following_key" UNIQUE using index "users_following_key";


