--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

-- Started on 2025-07-21 15:58:12

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
-- TOC entry 217 (class 1259 OID 24592)
-- Name: impresoras; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.impresoras (
    id integer NOT NULL,
    ip character varying(50) NOT NULL,
    sucursal character varying(100),
    modelo character varying(100),
    drivers_url text,
    tipo character varying(50),
    fecha_ultimo_cambio timestamp without time zone,
    cambios_toner integer DEFAULT 0,
    toner_reserva integer DEFAULT 0,
    toner_anterior integer DEFAULT 0,
    numero_serie text,
    contador_paginas integer,
    direccion text,
    telefono text,
    correo text,
    ultimo_pedido_contador integer,
    ultimo_pedido_fecha timestamp without time zone
);


ALTER TABLE public.impresoras OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 24600)
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
-- TOC entry 4854 (class 0 OID 0)
-- Dependencies: 218
-- Name: impresoras_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.impresoras_id_seq OWNED BY public.impresoras.id;


--
-- TOC entry 4696 (class 2604 OID 24601)
-- Name: impresoras id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.impresoras ALTER COLUMN id SET DEFAULT nextval('public.impresoras_id_seq'::regclass);


--
-- TOC entry 4847 (class 0 OID 24592)
-- Dependencies: 217
-- Data for Name: impresoras; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.impresoras (id, ip, sucursal, modelo, drivers_url, tipo, fecha_ultimo_cambio, cambios_toner, toner_reserva, toner_anterior, numero_serie, contador_paginas, direccion, telefono, correo, ultimo_pedido_contador, ultimo_pedido_fecha) FROM stdin;
15	192.168.2.22	Encarnacion	P 501/502	https://support.ricoh.com/bb/pub_e/dr_ut_e/0001343/0001343272/V3100/z03653L16.exe	backup	\N	0	0	0	\N	\N	Direcci¢n no especificada	\N	\N	\N	\N
16	192.168.46.22	Misiones	RICOH P 800	https://support.ricoh.com/bb/pub_e/dr_ut_e/0001343/0001343146/V3200/z04344L17.exe	backup	\N	0	0	0	\N	\N	Direcci¢n no especificada	\N	\N	\N	\N
14	192.168.3.22	Ciudad del Este	RICOH P 800	https://support.ricoh.com/bb/pub_e/dr_ut_e/0001343/0001343146/V3200/z04344L17.exe	backup	\N	0	0	-2	5302X453119	93516	Direcci¢n no especificada	\N	\N	\N	\N
1	192.168.7.21	Santani	RICOH P 800	https://support.ricoh.com/bb/pub_e/dr_ut_e/0001343/0001343146/V3200/z04344L17.exe	principal	2025-07-15 19:11:25.808407	2	2	100	5301XC46541	294369	 RUTA ACCESO A SANTANI - 200 METROS DE LA ROTONDA -SANTANI	0987 200316	bryan.medina@surcomercial.com.py	294369	2025-07-21 18:55:02.620161
69	192.168.3.21	Ciudad del Este	RICOH P 800	https://support.ricoh.com/bb/pub_e/dr_ut_e/0001343/0001343271/V3100/z03651L16.exe	principal	2025-07-18 14:16:48.023839	1	0	90	5302X453123	355035	Los Rosales esquina Padre Guillermo Bauman	\N	\N	\N	\N
8	192.168.8.41	Asuncion-RRHH	P 501/502	https://support.ricoh.com/bb/pub_e/dr_ut_e/0001343/0001343272/V3100/z03653L16.exe	principal	2025-07-01 14:32:48.995952	1	1	40	5380PC01014	84736	Direcci¢n no especificada	\N	\N	\N	\N
6	192.168.8.23	Asuncion	IM 430	https://support.ricoh.com/bb/pub_e/dr_ut_e/0001343/0001343273/V3100/z03655L16.exe	principal	2025-07-01 14:32:48.985148	1	1	70	3354P450006	43543	Direcci¢n no especificada	0987 200316	bryan.medina@surcomercial.com.py	\N	\N
11	192.168.7.22	Santani	P 501/502	https://support.ricoh.com/bb/pub_e/dr_ut_e/0001343/0001343272/V3100/z03653L16.exe	backup	2025-07-21 12:39:06.682192	2	0	100	5382P380185	24881	 RUTA ACCESO A SANTANI - 200 METROS DE LA ROTONDA -SANTANI	\N	\N	\N	\N
10	192.168.48.121	Concepcion	RICOH P 800	https://support.ricoh.com/bb/pub_e/dr_ut_e/0001343/0001343146/V3200/z04344L17.exe	principal	2025-07-03 11:26:37.00585	2	1	70	5304X375774	173061	Direcci¢n no especificada	\N	\N	\N	\N
9	192.168.46.21	Misiones	RICOH P 800	https://support.ricoh.com/bb/pub_e/dr_ut_e/0001343/0001343146/V3200/z04344L17.exe	principal	2025-07-01 14:32:49.00689	1	1	50	5302XA59354	192456	Direcci¢n no especificada	\N	\N	\N	\N
65	192.168.5.8	PJC	HP MFP M127fn	https://www.google.com/	backup	\N	0	1	0	\N	\N	Direcci¢n no especificada	\N	\N	\N	\N
13	192.168.4.22	Caaguazu	P 501/502	https://support.ricoh.com/bb/pub_e/dr_ut_e/0001343/0001343272/V3100/z03653L16.exe	backup	2025-07-01 14:32:49.048432	1	1	20	5382P380086	22742	Direcci¢n no especificada	\N	\N	\N	\N
7	192.168.8.20	Asuncion-color	P C600	https://support.ricoh.com/bb/pub_e/dr_ut_e/0001343/0001343154/V3200/z04340L16.exe	principal	2025-07-01 14:32:48.99016	1	1	80	5321X720063	25360	Direcci¢n no especificada	\N	\N	\N	\N
64	192.168.4.21	Caaguazu	RICOH P 800	https://support.ricoh.com/bb/pub_e/dr_ut_e/0001343/0001343146/V3200/z04344L17.exe	principal	2025-07-17 13:00:33.007094	1	0	60	5301XC46584	486269	RUTA 7 GASPAR R DE FRANCIA KM 180 	\N	\N	\N	\N
17	192.168.48.122	Concepcion	RICOH P 800	https://support.ricoh.com/bb/pub_e/dr_ut_e/0001343/0001343146/V3200/z04344L17.exe	backup	2025-07-01 14:32:50.027286	1	1	30	5304X375768	23871	Direcci¢n no especificada	\N	\N	\N	\N
68	192.168.48.8	Concepcion	HP LaserJet Pro M201dw	https://www.google.com/	backup	2025-07-18 12:26:47.813638	1	1	9	BRBSH2JD55	105295	concepcion	\N	\N	\N	\N
5	192.168.2.21	Encarnacion	SP 8400DN	https://support.ricoh.com/bb/pub_e/dr_ut_e/0001343/0001343271/V3100/z03651L16.exe	principal	2025-07-01 14:32:48.979574	1	2	50	Y871RA10103	342536	RUTA 1 KM 6 1.5 CERCA DE LA ENTRADA BARRIO ITA P 	0987 200316	bryan.medina@surcomercial.com.py	\N	\N
12	192.168.5.22	Pedro Juan Caballero	P 501/502	https://support.ricoh.com/bb/pub_e/dr_ut_e/0001343/0001343272/V3100/z03653L16.exe	backup	2025-07-01 14:32:49.03102	1	1	90	5382P380089	24252	Direcci¢n no especificada	\N	\N	\N	\N
63	192.168.5.21	PJC	RICOH P 800	https://support.ricoh.com/bb/pub_e/dr_ut_e/0001343/0001343146/V3200/z04344L17.exe	principal	2025-07-17 13:00:33.205654	1	0	90	5301XC46579	315963	Direcci¢n no especificada	\N	\N	\N	\N
\.


--
-- TOC entry 4855 (class 0 OID 0)
-- Dependencies: 218
-- Name: impresoras_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.impresoras_id_seq', 69, true);


--
-- TOC entry 4701 (class 2606 OID 24603)
-- Name: impresoras impresoras_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.impresoras
    ADD CONSTRAINT impresoras_pkey PRIMARY KEY (id);


-- Completed on 2025-07-21 15:58:12

--
-- PostgreSQL database dump complete
--

