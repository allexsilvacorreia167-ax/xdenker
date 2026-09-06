import { Routes, Route } from 'react-router-dom';
import ResponsiveUserLayout from './layouts/ResponsiveUserLayout';
import AdminDesktopLayout from './layouts/AdminDesktopLayout';
import HomePage from './pages/HomePage';
import PesquisasPage from './pages/PesquisasPage';
import BlogPage from './pages/BlogPage';
import ContatoPage from './pages/ContatoPage';
import MetodologiaPage from './pages/MetodologiaPage';
import QuestionarioPage from './pages/QuestionarioPage';
import ApuracaoPage from './pages/ApuracaoPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCandidatos from './pages/admin/AdminCandidatos';
import AdminPerguntas from './pages/admin/AdminPerguntas';
import AdminEspectro from './pages/admin/AdminEspectro';
import AdminUsuarios from './pages/admin/AdminUsuarios';
import AdminBlog from './pages/admin/AdminBlog';
import { AuthProvider } from './hooks/useAuth';
import { AdminAuthProvider } from './hooks/useAdminAuth';

// Sistema Político
import SistemaPoliticoGeral from './pages/sistema-politico/SistemaPoliticoGeral';
import ExecutivoFederal from './pages/sistema-politico/ExecutivoFederal';
import Senado from './pages/sistema-politico/Senado';
import Camara from './pages/sistema-politico/Camara';
import AssembleiasEstaduais from './pages/sistema-politico/AssembleiasEstaduais';

// Judiciário
import JudiciarioGeral from './pages/judiciario/JudiciarioGeral';
import STF from './pages/judiciario/STF';
import STJ from './pages/judiciario/STJ';
import TSE from './pages/judiciario/TSE';
import TST from './pages/judiciario/TST';
import STM from './pages/judiciario/STM';
import OrgaosControle from './pages/judiciario/OrgaosControle';

function App() {
  return (
    <AuthProvider>
      <AdminAuthProvider>
        <Routes>
          <Route element={<ResponsiveUserLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/pesquisas" element={<PesquisasPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/contato" element={<ContatoPage />} />
            <Route path="/metodologia" element={<MetodologiaPage />} />
            <Route path="/questionario" element={<QuestionarioPage />} />
            <Route path="/apuracao" element={<ApuracaoPage />} />

            {/* Sistema Político */}
            <Route path="/sistema-politico" element={<SistemaPoliticoGeral />} />
            <Route path="/sistema-politico/executivo" element={<ExecutivoFederal />} />
            <Route path="/sistema-politico/senado" element={<Senado />} />
            <Route path="/sistema-politico/camara" element={<Camara />} />
            <Route path="/sistema-politico/assembleias" element={<AssembleiasEstaduais />} />

            {/* Judiciário */}
            <Route path="/judiciario" element={<JudiciarioGeral />} />
            <Route path="/judiciario/stf" element={<STF />} />
            <Route path="/judiciario/stj" element={<STJ />} />
            <Route path="/judiciario/tse" element={<TSE />} />
            <Route path="/judiciario/tst" element={<TST />} />
            <Route path="/judiciario/stm" element={<STM />} />
            <Route path="/judiciario/controle" element={<OrgaosControle />} />
          </Route>

          {/* Login do admin fica fora do layout protegido, senão criaria loop de redirecionamento */}
          <Route path="/adm-painel/login" element={<AdminLoginPage />} />

          <Route path="/adm-painel" element={<AdminDesktopLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="candidatos" element={<AdminCandidatos />} />
            <Route path="perguntas" element={<AdminPerguntas />} />
            <Route path="espectro" element={<AdminEspectro />} />
            <Route path="blog" element={<AdminBlog />} />
            <Route path="usuarios" element={<AdminUsuarios />} />
          </Route>
        </Routes>
      </AdminAuthProvider>
    </AuthProvider>
  );
}

export default App;