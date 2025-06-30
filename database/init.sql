--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

-- Started on 2025-06-30 15:15:41

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 218 (class 1259 OID 16440)
-- Name: impresoras; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.impresoras (
    id integer NOT NULL,
    ip character varying(50) NOT NULL,
    sucursal character varying(100),
    modelo character varying(100),
    drivers_url text,
    tipo character varying(50)
);


ALTER TABLE public.impresoras OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16439)
-- Name: impresoras_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.impresoras_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.impresoras_id_seq OWNER TO postgres;

--
-- TOC entry 4796 (class 0 OID 0)
-- Dependencies: 217
-- Name: impresoras_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.impresoras_id_seq OWNED BY public.impresoras.id;


--
-- TOC entry 4641 (class 2604 OID 16443)
-- Name: impresoras id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.impresoras ALTER COLUMN id SET DEFAULT nextval('public.impresoras_id_seq'::regclass);


--
-- TOC entry 4790 (class 0 OID 16440)
-- Dependencies: 218
-- Data for Name: impresoras; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.impresoras (id, ip, sucursal, modelo, drivers_url, tipo) FROM stdin;
10	192.168.48.121	Concepcion	RICOH P 800	https://support.ricoh.com/bb/pub_e/dr_ut_e/0001343/0001343146/V3200/z04344L17.exe	principal
2	192.168.5.21	Pedro Juan Caballero	RICOH P 800	https://support.ricoh.com/bb/pub_e/dr_ut_e/0001343/0001343146/V3200/z04344L17.exe	principal
3	192.168.4.21	Caaguazu	RICOH P 800	https://support.ricoh.com/bb/pub_e/dr_ut_e/0001343/0001343146/V3200/z04344L17.exe	principal
4	192.168.3.21	Ciudad del Este	RICOH P 800	https://support.ricoh.com/bb/pub_e/dr_ut_e/0001343/0001343146/V3200/z04344L17.exe	principal
5	192.168.2.21	Encarnacion	SP 8400DN	https://support.ricoh.com/bb/pub_e/dr_ut_e/0001343/0001343271/V3100/z03651L16.exe	principal
6	192.168.8.23	Asuncion	IM 430	https://support.ricoh.com/bb/pub_e/dr_ut_e/0001343/0001343273/V3100/z03655L16.exe	principal
7	192.168.8.20	Asuncion-color	P C600	https://support.ricoh.com/bb/pub_e/dr_ut_e/0001343/0001343154/V3200/z04340L16.exe	principal
8	192.168.8.41	Asuncion-RRHH	P 501/502	https://support.ricoh.com/bb/pub_e/dr_ut_e/0001343/0001343272/V3100/z03653L16.exe	principal
9	192.168.46.21	Misiones	RICOH P 800	https://support.ricoh.com/bb/pub_e/dr_ut_e/0001343/0001343146/V3200/z04344L17.exe	principal
11	192.168.7.22	Santani	P 501/502	https://support.ricoh.com/bb/pub_e/dr_ut_e/0001343/0001343272/V3100/z03653L16.exe	backup
12	192.168.5.22	Pedro Juan Caballero	P 501/502	https://support.ricoh.com/bb/pub_e/dr_ut_e/0001343/0001343272/V3100/z03653L16.exe	backup
13	192.168.4.22	Caaguazu	P 501/502	https://support.ricoh.com/bb/pub_e/dr_ut_e/0001343/0001343272/V3100/z03653L16.exe	backup
14	192.168.3.22	Ciudad del Este	RICOH P 800	https://support.ricoh.com/bb/pub_e/dr_ut_e/0001343/0001343146/V3200/z04344L17.exe	backup
17	192.168.48.122	Concepcion	RICOH P 800	https://support.ricoh.com/bb/pub_e/dr_ut_e/0001343/0001343146/V3200/z04344L17.exe	backup
15	192.168.2.22	Encarnacion	P 501/502	https://support.ricoh.com/bb/pub_e/dr_ut_e/0001343/0001343272/V3100/z03653L16.exe	backup
16	192.168.46.22	Misiones	RICOH P 800	https://support.ricoh.com/bb/pub_e/dr_ut_e/0001343/0001343146/V3200/z04344L17.exe	backup
1	192.168.7.21	Santani	RICOH P 800	https://support.ricoh.com/bb/pub_e/dr_ut_e/0001343/0001343146/V3200/z04344L17.exe	principal
\.


--
-- TOC entry 4797 (class 0 OID 0)
-- Dependencies: 217
-- Name: impresoras_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.impresoras_id_seq', 27, true);


--
-- TOC entry 4643 (class 2606 OID 16447)
-- Name: impresoras impresoras_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.impresoras
    ADD CONSTRAINT impresoras_pkey PRIMARY KEY (id);


-- Completed on 2025-06-30 15:15:41

--
-- PostgreSQL database dump complete
--

