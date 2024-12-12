create table "public"."comment" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "content" text not null,
    "user_id" uuid not null,
    "post_id" bigint not null
);


alter table "public"."comment" enable row level security;

create table "public"."follow" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "follower_id" uuid not null,
    "followee_id" uuid not null
);


alter table "public"."follow" enable row level security;

create table "public"."like" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "post_id" bigint not null,
    "user_id" uuid not null
);


alter table "public"."like" enable row level security;

create table "public"."post" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "title" text not null,
    "abstract" text not null,
    "text" text not null,
    "image_url" text,
    "created_by" uuid
);


alter table "public"."post" enable row level security;

create table "public"."post_tag" (
    "post_id" bigint not null,
    "tag_id" bigint not null
);


alter table "public"."post_tag" enable row level security;

create table "public"."tag" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "name" text
);


alter table "public"."tag" enable row level security;

create table "public"."user" (
    "id" uuid not null,
    "created_at" timestamp with time zone not null default now(),
    "first_name" text not null default ''::text,
    "last_name" text not null default ''::text,
    "user_name" text not null default ''::text,
    "email" text not null default ''::text,
    "unique_user_name" text not null default ''::text
);


alter table "public"."user" enable row level security;

CREATE UNIQUE INDEX comment_pkey ON public.comment USING btree (id);

CREATE UNIQUE INDEX follow_pkey ON public.follow USING btree (id);

CREATE UNIQUE INDEX hashtags_name_key ON public.tag USING btree (name);

CREATE UNIQUE INDEX hashtags_pkey ON public.tag USING btree (id);

CREATE UNIQUE INDEX like_pkey ON public."like" USING btree (id);

CREATE UNIQUE INDEX post_tag_pkey ON public.post_tag USING btree (post_id, tag_id);

CREATE UNIQUE INDEX posts_pkey ON public.post USING btree (id);

CREATE UNIQUE INDEX user_email_key ON public."user" USING btree (email);

CREATE UNIQUE INDEX users_pkey ON public."user" USING btree (id);

CREATE UNIQUE INDEX users_user_name_key ON public."user" USING btree (unique_user_name);

alter table "public"."comment" add constraint "comment_pkey" PRIMARY KEY using index "comment_pkey";

alter table "public"."follow" add constraint "follow_pkey" PRIMARY KEY using index "follow_pkey";

alter table "public"."like" add constraint "like_pkey" PRIMARY KEY using index "like_pkey";

alter table "public"."post" add constraint "posts_pkey" PRIMARY KEY using index "posts_pkey";

alter table "public"."post_tag" add constraint "post_tag_pkey" PRIMARY KEY using index "post_tag_pkey";

alter table "public"."tag" add constraint "hashtags_pkey" PRIMARY KEY using index "hashtags_pkey";

alter table "public"."user" add constraint "users_pkey" PRIMARY KEY using index "users_pkey";

alter table "public"."comment" add constraint "comment_post_id_fkey" FOREIGN KEY (post_id) REFERENCES post(id) ON DELETE CASCADE not valid;

alter table "public"."comment" validate constraint "comment_post_id_fkey";

alter table "public"."comment" add constraint "comment_user_id_fkey" FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE not valid;

alter table "public"."comment" validate constraint "comment_user_id_fkey";

alter table "public"."follow" add constraint "follow_followee_id_fkey" FOREIGN KEY (followee_id) REFERENCES "user"(id) ON DELETE CASCADE not valid;

alter table "public"."follow" validate constraint "follow_followee_id_fkey";

alter table "public"."follow" add constraint "user_relationship_follower_id_fkey" FOREIGN KEY (follower_id) REFERENCES "user"(id) ON DELETE CASCADE not valid;

alter table "public"."follow" validate constraint "user_relationship_follower_id_fkey";

alter table "public"."like" add constraint "like_post_id_fkey" FOREIGN KEY (post_id) REFERENCES post(id) ON DELETE CASCADE not valid;

alter table "public"."like" validate constraint "like_post_id_fkey";

alter table "public"."like" add constraint "like_user_id_fkey" FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE not valid;

alter table "public"."like" validate constraint "like_user_id_fkey";

alter table "public"."post" add constraint "post_created_by_fkey" FOREIGN KEY (created_by) REFERENCES "user"(id) ON DELETE CASCADE not valid;

alter table "public"."post" validate constraint "post_created_by_fkey";

alter table "public"."post_tag" add constraint "post_tag_post_id_fkey" FOREIGN KEY (post_id) REFERENCES post(id) ON DELETE CASCADE not valid;

alter table "public"."post_tag" validate constraint "post_tag_post_id_fkey";

alter table "public"."post_tag" add constraint "post_tag_tag_id_fkey" FOREIGN KEY (tag_id) REFERENCES tag(id) ON DELETE CASCADE not valid;

alter table "public"."post_tag" validate constraint "post_tag_tag_id_fkey";

alter table "public"."tag" add constraint "hashtags_name_key" UNIQUE using index "hashtags_name_key";

alter table "public"."user" add constraint "user_email_key" UNIQUE using index "user_email_key";

alter table "public"."user" add constraint "users_user_name_key" UNIQUE using index "users_user_name_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.create_user_on_signup()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$BEGIN
    INSERT INTO public.user (id, created_at, first_name, last_name, user_name, unique_user_name, email)
    VALUES (
        NEW.id, 
        NEW.created_at, 
        NEW.raw_user_meta_data ->> 'firstName', 
        NEW.raw_user_meta_data ->> 'lastName', 
        NEW.raw_user_meta_data ->> 'userName',
        NEW.raw_user_meta_data ->> 'uniqueUserName',
        NEW.email);
    RETURN NEW;
END;$function$
;

grant delete on table "public"."comment" to "anon";

grant insert on table "public"."comment" to "anon";

grant references on table "public"."comment" to "anon";

grant select on table "public"."comment" to "anon";

grant trigger on table "public"."comment" to "anon";

grant truncate on table "public"."comment" to "anon";

grant update on table "public"."comment" to "anon";

grant delete on table "public"."comment" to "authenticated";

grant insert on table "public"."comment" to "authenticated";

grant references on table "public"."comment" to "authenticated";

grant select on table "public"."comment" to "authenticated";

grant trigger on table "public"."comment" to "authenticated";

grant truncate on table "public"."comment" to "authenticated";

grant update on table "public"."comment" to "authenticated";

grant delete on table "public"."comment" to "service_role";

grant insert on table "public"."comment" to "service_role";

grant references on table "public"."comment" to "service_role";

grant select on table "public"."comment" to "service_role";

grant trigger on table "public"."comment" to "service_role";

grant truncate on table "public"."comment" to "service_role";

grant update on table "public"."comment" to "service_role";

grant delete on table "public"."follow" to "anon";

grant insert on table "public"."follow" to "anon";

grant references on table "public"."follow" to "anon";

grant select on table "public"."follow" to "anon";

grant trigger on table "public"."follow" to "anon";

grant truncate on table "public"."follow" to "anon";

grant update on table "public"."follow" to "anon";

grant delete on table "public"."follow" to "authenticated";

grant insert on table "public"."follow" to "authenticated";

grant references on table "public"."follow" to "authenticated";

grant select on table "public"."follow" to "authenticated";

grant trigger on table "public"."follow" to "authenticated";

grant truncate on table "public"."follow" to "authenticated";

grant update on table "public"."follow" to "authenticated";

grant delete on table "public"."follow" to "service_role";

grant insert on table "public"."follow" to "service_role";

grant references on table "public"."follow" to "service_role";

grant select on table "public"."follow" to "service_role";

grant trigger on table "public"."follow" to "service_role";

grant truncate on table "public"."follow" to "service_role";

grant update on table "public"."follow" to "service_role";

grant delete on table "public"."like" to "anon";

grant insert on table "public"."like" to "anon";

grant references on table "public"."like" to "anon";

grant select on table "public"."like" to "anon";

grant trigger on table "public"."like" to "anon";

grant truncate on table "public"."like" to "anon";

grant update on table "public"."like" to "anon";

grant delete on table "public"."like" to "authenticated";

grant insert on table "public"."like" to "authenticated";

grant references on table "public"."like" to "authenticated";

grant select on table "public"."like" to "authenticated";

grant trigger on table "public"."like" to "authenticated";

grant truncate on table "public"."like" to "authenticated";

grant update on table "public"."like" to "authenticated";

grant delete on table "public"."like" to "service_role";

grant insert on table "public"."like" to "service_role";

grant references on table "public"."like" to "service_role";

grant select on table "public"."like" to "service_role";

grant trigger on table "public"."like" to "service_role";

grant truncate on table "public"."like" to "service_role";

grant update on table "public"."like" to "service_role";

grant delete on table "public"."post" to "anon";

grant insert on table "public"."post" to "anon";

grant references on table "public"."post" to "anon";

grant select on table "public"."post" to "anon";

grant trigger on table "public"."post" to "anon";

grant truncate on table "public"."post" to "anon";

grant update on table "public"."post" to "anon";

grant delete on table "public"."post" to "authenticated";

grant insert on table "public"."post" to "authenticated";

grant references on table "public"."post" to "authenticated";

grant select on table "public"."post" to "authenticated";

grant trigger on table "public"."post" to "authenticated";

grant truncate on table "public"."post" to "authenticated";

grant update on table "public"."post" to "authenticated";

grant delete on table "public"."post" to "service_role";

grant insert on table "public"."post" to "service_role";

grant references on table "public"."post" to "service_role";

grant select on table "public"."post" to "service_role";

grant trigger on table "public"."post" to "service_role";

grant truncate on table "public"."post" to "service_role";

grant update on table "public"."post" to "service_role";

grant delete on table "public"."post_tag" to "anon";

grant insert on table "public"."post_tag" to "anon";

grant references on table "public"."post_tag" to "anon";

grant select on table "public"."post_tag" to "anon";

grant trigger on table "public"."post_tag" to "anon";

grant truncate on table "public"."post_tag" to "anon";

grant update on table "public"."post_tag" to "anon";

grant delete on table "public"."post_tag" to "authenticated";

grant insert on table "public"."post_tag" to "authenticated";

grant references on table "public"."post_tag" to "authenticated";

grant select on table "public"."post_tag" to "authenticated";

grant trigger on table "public"."post_tag" to "authenticated";

grant truncate on table "public"."post_tag" to "authenticated";

grant update on table "public"."post_tag" to "authenticated";

grant delete on table "public"."post_tag" to "service_role";

grant insert on table "public"."post_tag" to "service_role";

grant references on table "public"."post_tag" to "service_role";

grant select on table "public"."post_tag" to "service_role";

grant trigger on table "public"."post_tag" to "service_role";

grant truncate on table "public"."post_tag" to "service_role";

grant update on table "public"."post_tag" to "service_role";

grant delete on table "public"."tag" to "anon";

grant insert on table "public"."tag" to "anon";

grant references on table "public"."tag" to "anon";

grant select on table "public"."tag" to "anon";

grant trigger on table "public"."tag" to "anon";

grant truncate on table "public"."tag" to "anon";

grant update on table "public"."tag" to "anon";

grant delete on table "public"."tag" to "authenticated";

grant insert on table "public"."tag" to "authenticated";

grant references on table "public"."tag" to "authenticated";

grant select on table "public"."tag" to "authenticated";

grant trigger on table "public"."tag" to "authenticated";

grant truncate on table "public"."tag" to "authenticated";

grant update on table "public"."tag" to "authenticated";

grant delete on table "public"."tag" to "service_role";

grant insert on table "public"."tag" to "service_role";

grant references on table "public"."tag" to "service_role";

grant select on table "public"."tag" to "service_role";

grant trigger on table "public"."tag" to "service_role";

grant truncate on table "public"."tag" to "service_role";

grant update on table "public"."tag" to "service_role";

grant delete on table "public"."user" to "anon";

grant insert on table "public"."user" to "anon";

grant references on table "public"."user" to "anon";

grant select on table "public"."user" to "anon";

grant trigger on table "public"."user" to "anon";

grant truncate on table "public"."user" to "anon";

grant update on table "public"."user" to "anon";

grant delete on table "public"."user" to "authenticated";

grant insert on table "public"."user" to "authenticated";

grant references on table "public"."user" to "authenticated";

grant select on table "public"."user" to "authenticated";

grant trigger on table "public"."user" to "authenticated";

grant truncate on table "public"."user" to "authenticated";

grant update on table "public"."user" to "authenticated";

grant delete on table "public"."user" to "service_role";

grant insert on table "public"."user" to "service_role";

grant references on table "public"."user" to "service_role";

grant select on table "public"."user" to "service_role";

grant trigger on table "public"."user" to "service_role";

grant truncate on table "public"."user" to "service_role";

grant update on table "public"."user" to "service_role";

create policy "Enable insert for authenticated users only"
on "public"."comment"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."comment"
as permissive
for select
to public
using (true);


create policy "allow authenticated users to update"
on "public"."comment"
as permissive
for update
to public
using ((auth.role() = 'authenticated'::text))
with check (true);


create policy "Enable delete for authenticated users "
on "public"."follow"
as permissive
for delete
to public
using ((auth.role() = 'authenticated'::text));


create policy "Enable insert for authenticated users only"
on "public"."follow"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."follow"
as permissive
for select
to public
using (true);


create policy "Enable delete for users based on user_id"
on "public"."like"
as permissive
for delete
to public
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Enable insert for authenticated users only"
on "public"."like"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."like"
as permissive
for select
to public
using (true);


create policy "allow authenticated users to update"
on "public"."like"
as permissive
for update
to public
using ((auth.role() = 'authenticated'::text))
with check (true);


create policy "Enable insert for authenticated users only"
on "public"."post"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."post"
as permissive
for select
to public
using (true);


create policy "allow authenticated users to update"
on "public"."post"
as permissive
for update
to public
using ((auth.role() = 'authenticated'::text))
with check (true);


create policy "Enable insert for authenticated users only"
on "public"."post_tag"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."post_tag"
as permissive
for select
to public
using (true);


create policy "allow authenticated users to update"
on "public"."post_tag"
as permissive
for update
to public
using ((auth.role() = 'authenticated'::text))
with check (true);


create policy "Enable insert for authenticated users only"
on "public"."tag"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."tag"
as permissive
for select
to public
using (true);


create policy "allow authenticated users to update"
on "public"."tag"
as permissive
for update
to public
using ((auth.role() = 'authenticated'::text))
with check (true);


create policy "Enable UPDATE for authenticated users"
on "public"."user"
as permissive
for update
to public
using ((auth.role() = 'authenticated'::text))
with check (true);


create policy "Enable insert for authenticated users only"
on "public"."user"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for all users"
on "public"."user"
as permissive
for select
to public
using (true);



