import React, { useState, useEffect } from "react";
import { DataGrid, GridCellParams, GridColDef } from "@mui/x-data-grid";
import {
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import "./styles.css";
import { Delete, Edit } from "lucide-react";

// Interface que define a estrutura de um jogo
interface Jogo {
  id: number;
  titulo: string;
  plataforma: string;
  genero: string;
}

// Componente principal da vitrine
const Vitrine = () => {
  // Estado para armazenar a lista de jogos
  const [jogos, setJogos] = useState<Jogo[]>([]);

  // Estados para os campos do formulário
  const [titulo, setTitulo] = useState("");
  const [plataforma, setPlataforma] = useState("");
  const [genero, setGenero] = useState("");

  // Estado para armazenar o jogo que está sendo editado
  const [editingJogo, setEditingJogo] = useState<Jogo | null>(null);

  // Estado para controlar a abertura/fechamento do diálogo de edição
  const [openDialog, setOpenDialog] = useState(false);

  // Efeito executado ao montar o componente para recuperar os jogos salvos no localStorage
  useEffect(() => {
    const jogosSalvos = localStorage.getItem("jogos");
    if (jogosSalvos) {
      setJogos(JSON.parse(jogosSalvos));
    }
  }, []);

  // Efeito executado sempre que o estado 'jogos' é alterado para salvar os jogos no localStorage
  useEffect(() => {
    localStorage.setItem("jogos", JSON.stringify(jogos));
  }, [jogos]);

  // Função para lidar com o envio do formulário
  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (editingJogo) {
      // Atualiza o jogo existente com as informações do formulário
      const updatedJogo: Jogo = {
        ...editingJogo,
        titulo,
        plataforma,
        genero,
      };
      setJogos((prevJogos) =>
        prevJogos.map((jogo) =>
          jogo.id === editingJogo.id ? updatedJogo : jogo
        )
      );
      setEditingJogo(null); // Limpa o jogo em edição
    } else {
      // Cria um novo jogo com as informações do formulário
      const novoJogo: Jogo = {
        id: jogos.length + 1,
        titulo,
        plataforma,
        genero,
      };
      setJogos([...jogos, novoJogo]);
    }
    // Limpa os campos do formulário
    setTitulo("");
    setPlataforma("");
    setGenero("");
    handleCloseDialog(); // Fecha o diálogo de edição
  };

  // Função para lidar com o clique no botão de exclusão de um jogo na tabela
  const handleDeleteClick = (params: GridCellParams) => {
    const { id } = params.row;
    setJogos((prevJogos) => prevJogos.filter((jogo) => jogo.id !== id));
  };

  // Função para lidar com o clique no botão de edição de um jogo na tabela
  const handleEditClick = (params: GridCellParams) => {
    const { id, titulo, plataforma, genero } = params.row;
    setEditingJogo({ id, titulo, plataforma, genero }); // Define o jogo em edição
    setTitulo(titulo); // Preenche os campos do formulário com as informações do jogo em edição
    setPlataforma(plataforma);
    setGenero(genero);
    setOpenDialog(true); // Abre o diálogo de edição
  };

  // Função para fechar o diálogo de edição e limpar os campos do formulário
  const handleCloseDialog = () => {
    setEditingJogo(null);
    setOpenDialog(false);
    setTitulo("");
    setPlataforma("");
    setGenero("");
  };

  // Definição das colunas da tabela
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "titulo", headerName: "Título", width: 200 },
    { field: "plataforma", headerName: "Plataforma", width: 150 },
    { field: "genero", headerName: "Gênero", width: 150 },
    {
      field: "editar",
      headerName: "Editar",
      width: 100,
      sortable: false,
      renderCell: (params: GridCellParams) => (
        // Botão de edição
        <Button
          variant="outlined"
          color="primary"
          size="small"
          onClick={() => handleEditClick(params)}
        >
          <Edit />
        </Button>
      ),
    },
    {
      field: "excluir",
      headerName: "Excluir",
      width: 100,
      sortable: false,
      renderCell: (params: GridCellParams) => (
        // Botão de exclusão
        <Button
          variant="outlined"
          color="secondary"
          size="small"
          onClick={() => handleDeleteClick(params)}
        >
          <Delete />
        </Button>
      ),
    },
  ];

  return (
    <>
      <h1>Crud de Games</h1>
      <div className="container">
        <div className="formulario">
          <form onSubmit={handleFormSubmit}>
            <TextField
              label="Título"
              value={titulo}
              onChange={(event) => setTitulo(event.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Plataforma"
              value={plataforma}
              onChange={(event: {
                target: { value: React.SetStateAction<string> };
              }) => setPlataforma(event.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Gênero"
              value={genero}
              onChange={(event) => setGenero(event.target.value)}
              fullWidth
              margin="normal"
            />
            <Button type="submit" variant="contained" color="primary">
              {editingJogo ? "Editar" : "Cadastrar"}
            </Button>
          </form>
        </div>
        <div className="tabela">
          <div style={{ height: 400, width: "100%" }}>
            {/* Tabela de jogos */}
            <DataGrid rows={jogos} columns={columns} pageSize={5} />
          </div>
        </div>
      </div>
      {/* Diálogo de edição */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Editar Jogo</DialogTitle>
        <DialogContent>
          <form onSubmit={handleFormSubmit}>
            <TextField
              label="Título"
              value={titulo}
              onChange={(event) => setTitulo(event.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Plataforma"
              value={plataforma}
              onChange={(event: {
                target: { value: React.SetStateAction<string> };
              }) => setPlataforma(event.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Gênero"
              value={genero}
              onChange={(event) => setGenero(event.target.value)}
              fullWidth
              margin="normal"
            />
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                Cancelar
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Editar
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Vitrine;
