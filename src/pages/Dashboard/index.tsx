import React, { useState, FormEvent, useEffect } from 'react';

// importação dos icones no react
import { FiChevronRight } from 'react-icons/fi';

// importação da api
import api from '../../services/api';

// importação dos arquivos
import appLogo from '../../assets/images/logo.svg';

// importação dos estilos
import { Title, Form, Repositories, Error } from './styles';

interface Repository {
  full_name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

const Dashboard: React.FC = () => {
  const [newRepo, setNewRepo] = useState('');
  const [error, setError] = useState('');

  // usa um valor padrao para os repositorios
  const [repositories, setRepositories] = useState<Repository[]>(() => {
    const storageRepostitories = localStorage.getItem(
      '@github-explorer:repositories',
    );

    if (storageRepostitories) {
      return JSON.parse(storageRepostitories);
    }

    return [];
  });

  // Quando houver uma mudança na variável repositories
  // executa a função e guarda no local estorage
  useEffect(() => {
    localStorage.setItem(
      '@github-explorer:repositories',
      JSON.stringify(repositories),
    );
  }, [repositories]);

  /**
   * Função para manipulação da ação de adicionar um novo repositório.
   * @param event
   */
  async function handleAddRepositories(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!newRepo) {
      setError('Você deve informar o autor/repositório do github');
      return;
    }

    try {
      const response = await api.get<Repository>(`/repos/${newRepo}`);
      const repository = response.data;
      setRepositories([...repositories, repository]);

      setError('');
      setNewRepo('');
    } catch (err) {
      setError('Não foi possível encontrar o repositório informado.');
    }
  }

  return (
    <>
      <img src={appLogo} alt="Github explorer" />
      <Title>Explore repositórios no Github.</Title>

      <Form hasError={!!error} onSubmit={handleAddRepositories}>
        <input
          type="text"
          placeholder="Digite o nome do repositório"
          value={newRepo}
          onChange={e => {
            setNewRepo(e.target.value);
          }}
        />
        <button type="submit">Pesquisar</button>
      </Form>

      <Error>{error}</Error>

      <Repositories>
        {repositories.map(repository => (
          <a href="teste" key={repository.full_name}>
            <img
              src={repository.owner.avatar_url}
              alt={repository.owner.login}
            />
            <div>
              <strong>{repository.full_name}</strong>
              <p>{repository.description}</p>
            </div>
            <FiChevronRight />
          </a>
        ))}
      </Repositories>
    </>
  );
};

export default Dashboard;
