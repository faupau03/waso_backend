--
-- PostgreSQL database dump
--

-- Dumped from database version 14.0 (Debian 14.0-1.pgdg110+1)
-- Dumped by pg_dump version 14.1

-- Started on 2021-12-02 15:05:06

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 828 (class 1247 OID 16520)
-- Name: user_games_status; Type: TYPE; Schema: public; Owner: postgres
--


-- TODO: needed?


DO $$
BEGIN
	CREATE TYPE public.user_games_status AS ENUM (
            'playing',
            'dead',
            'won',
            'lost'
    );
	EXCEPTION WHEN DUPLICATE_OBJECT THEN
		RAISE NOTICE 'user_game_status  exists, skipping...';
END $$;



-- ALTER TYPE public.user_games_status OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 213 (class 1259 OID 16538)
-- Name: games; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS public.games (
    id integer NOT NULL,
    name character varying,
    created timestamp with time zone DEFAULT now(),
    updated timestamp with time zone DEFAULT now(),
    money boolean DEFAULT true NOT NULL,
    finished boolean DEFAULT false NOT NULL
);


ALTER TABLE public.games OWNER TO postgres;



--
-- TOC entry 211 (class 1259 OID 16527)
-- Name: user_games; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS public.user_games (
    user_id integer,
    game_id integer,
    status integer DEFAULT 1,
    money money,
    data character varying[]
);


ALTER TABLE public.user_games OWNER TO postgres;

--
-- TOC entry 3336 (class 0 OID 0)
-- Dependencies: 211
-- Name: COLUMN user_games.status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.user_games.status IS '0: dead, 1: playing, 2: won, 3: lost';


--
-- TOC entry 212 (class 1259 OID 16531)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE IF NOT EXISTS public.users (
    id integer NOT NULL,
    name character varying,
    created timestamp without time zone
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 3337 (class 0 OID 0)
-- Dependencies: 212
-- Name: COLUMN users.created; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.users.created IS 'When user was created';


--
-- TOC entry 3189 (class 2606 OID 16547)
-- Name: games games_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

DO $$
BEGIN
	ALTER TABLE ONLY public.games
        ADD CONSTRAINT games_pkey PRIMARY KEY (id);
	EXCEPTION WHEN invalid_table_definition THEN
		RAISE NOTICE 'games contraint exists, skipping...';
END $$;

-- ALTER TABLE ONLY public.games
--     ADD CONSTRAINT games_pkey PRIMARY KEY (id);


--
-- TOC entry 3187 (class 2606 OID 16537)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

DO $$
BEGIN
	ALTER TABLE ONLY public.users
        ADD CONSTRAINT users_pkey PRIMARY KEY (id);
	EXCEPTION WHEN invalid_table_definition THEN
		RAISE NOTICE 'games contraint exists, skipping...';
END $$;


--
-- TOC entry 3191 (class 2606 OID 16553)
-- Name: user_games user_games_game_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
DO $$
BEGIN
	ALTER TABLE ONLY public.user_games
        ADD CONSTRAINT user_games_game_id_fkey FOREIGN KEY (game_id) REFERENCES public.games(id);
	EXCEPTION WHEN invalid_table_definition THEN
		RAISE NOTICE 'games contraint exists, skipping...';
END $$;

-- ALTER TABLE ONLY public.user_games
--     ADD CONSTRAINT user_games_game_id_fkey FOREIGN KEY (game_id) REFERENCES public.games(id);


--
-- TOC entry 3190 (class 2606 OID 16548)
-- Name: user_games user_games_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
DO $$
BEGIN
	ALTER TABLE ONLY public.user_games
        ADD CONSTRAINT user_games_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);
	EXCEPTION WHEN invalid_table_definition THEN
		RAISE NOTICE 'games contraint exists, skipping...';
END $$;

--ALTER TABLE ONLY public.user_games
--   ADD CONSTRAINT user_games_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


-- Completed on 2021-12-02 15:05:07

--
-- PostgreSQL database dump complete
--

