from sqlalchemy import create_engine, Column, String, Integer, Float, Boolean, ForeignKey
from sqlalchemy.orm import declarative_base
from sqlalchemy_utils.types import ChoiceType

db = create_engine("postgreSQL:///baco.db")

Base = declarative_base()

class Usuario(Base):
    __tablename__ = "usuario"

    TIPOS_USUARIOS = (
        ("turista", "turista"),
        ("gestor", "gestor"),
        ("super_usuario", "super_usuario")
    )

    id_usuario = Column("id_usuario", Integer, primary_key=True, autoincrement=True)
    nome = Column("nome", String, nullable=False)
    email = Column("email", String, nullable=False)
    senha = Column("senha", String, nullable=False)
    u_tipo = Column("u_tipo", ChoiceType(choices=TIPOS_USUARIOS), nullable=False)

    def __init__(self, nome, email, senha, u_tipo):
        self.nome = nome
        self.email = email
        self.senha = senha
        self.u_tipo = u_tipo

class Ponto_Turistico(Base):
    __tablename__ = "ponto_turistico"

    id_ponto = Column("id_ponto", Integer, primary_key=True, autoincrement=True)
    nome = Column("nome", String, nullable=False)
    descricao = Column("descricao", String, nullable=False)
    localizacao = Column("localizacao", String, nullable=False)
    data_hora = Column("data_hora", String, nullable=False)
    t_tipo = Column("t_tipo", String, nullable=False)
    id_gestor = Column("id_gestor", Integer, ForeignKey("usuario.id_usurio"), nullable=False)

    def __init__(self, nome, descricao, localizacao, data_hora, t_tipo, id_gestor):
        self.nome = nome
        self.descricao = descricao
        self.localizacao = localizacao
        self.data_hora = data_hora
        self.t_tipo = t_tipo
        self.id_gestor = id_gestor

class Midia(Base):
    __tablename__ = "midia"

    id_midia = Column("id_midia", Integer, primary_key=True, autoincrement=True)
    id_ponto = Column("id_ponto", Integer, ForeignKey("ponto_turistico.id"))
    m_tipo = Column("m_tipo", String, nullable=False)
    url = Column("url", String, nullable=False)
    data_upload = Column("data_upload", String)

    def __init__(self, id_ponto, m_tipo, url, data_upload):
        self.id_ponto = id_ponto
        self.m_tipo = m_tipo
        self.url = url
        self.data_upload = data_upload
        
class Avaliacao(Base):
    __tablename__ = "avaliacao"

    id_avaliacao = Column("id_avaliacao", Integer, primary_key=True, autoincrement=True)
    id_turista = Column("id_turista", Integer, ForeignKey("usuario.id"), nullable=False)    
    id_ponto = Column("id_ponto", Integer, ForeignKey("ponto_turistico.id"), nullable=False)
    nota = Column("nota", Float, nullable=False)
    comentario = Column("comentario", String)
    data_avaliacao = Column("data_avaliacao", String)

    def __init__(self, id_turista, id_ponto, nota, comentario, data_avaliacao):
        self.id_turista = id_turista
        self.id_ponto = id_ponto
        self.nota = nota
        self.comentario = comentario
        self.data_avaliacao = data_avaliacao
        
class Agendamento(Base):
    __tablename__ = "agendamento"

    id_agendamento = Column("id_agendamento", Integer, primary_key=True, autoincrement=True)
    id_turista = Column("id_turista", Integer, ForeignKey("usuario.id"), nullable=False)    
    id_ponto = Column("id_ponto", Integer, ForeignKey("ponto_turistico.id"), nullable=False)
    data_visita = Column("data_visita", String, nullable=False)

    def __init__(self, id_turista, id_ponto, data_visita):
        self.id_turista = id_turista
        self.id_ponto = id_ponto
        self.data_visita = data_visita

class Historico_Ponto(Base):
    __tablename__ = "historico_ponto"

    id_historico = Column("id_historico", Integer, primary_key=True, autoincrement=True)
    id_ponto_h = Column("id_ponto_h", Integer, ForeignKey("ponto_turistico.id"))
    acao = Column("acao", String)
    descricao_antiga = Column("descricao_antiga", String)
    data_hist = Column("data_hist", String)

    def __init__(self, id_ponto_h, acao, descricao_antiga, data_hist):
        self.id_ponto_h = id_ponto_h
        self.acao = acao
        self.descricao_antiga = descricao_antiga
        self.data_hist = data_hist
