
import React, { useState } from 'react';
import { Layers, Plus, Calendar, ShieldCheck, ChevronRight, Archive, LayoutGrid, X, Search, MoreHorizontal, FolderPlus, DatabaseZap, Cloud, Trash2, AlertTriangle } from 'lucide-react';
import { Project } from '../types';

interface ProjectHubProps {
  projects: Project[];
  currentProjectId: string | null;
  onSelectProject: (id: string) => void;
  onCreateProject: (name: string, desc: string) => void;
  onDeleteProject: (id: string) => void;
}

const ProjectHub: React.FC<ProjectHubProps> = ({ projects, currentProjectId, onSelectProject, onCreateProject, onDeleteProject }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) return;
    onCreateProject(projectName, projectDesc);
    setProjectName('');
    setProjectDesc('');
    setIsCreating(false);
  };

  return (
    <div className="max-w-7xl mx-auto py-12 space-y-12 animate-in fade-in duration-1000">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <span className="text-indigo-500 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Infrastructure Layer</span>
          <h2 className="text-6xl font-black text-white uppercase italic tracking-tighter">PROJECT <span className="text-indigo-500">WORKSPACES.</span></h2>
          <p className="text-gray-500 text-lg font-medium italic">Isolated nodes for multi-client risk isolation.</p>
        </div>
        <button 
          onClick={() => setIsCreating(true)} 
          className="px-10 py-5 bg-white text-black font-black rounded-[32px] flex items-center gap-4 text-sm uppercase tracking-widest shadow-2xl hover:bg-indigo-600 hover:text-white transition-all active:scale-95"
        >
          <FolderPlus size={20} /> New Workspace
        </button>
      </div>

      <div className="bg-[#0a0a0a] border border-white/10 rounded-[56px] p-2 shadow-2xl relative overflow-hidden group">
         <div className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors">
           <Search size={22} />
         </div>
         <input 
           type="text" 
           value={searchTerm}
           onChange={(e) => setSearchTerm(e.target.value)}
           placeholder="Semantic Workspace Filter..." 
           className="w-full bg-transparent border-none py-7 pl-20 pr-8 text-xl font-bold text-white outline-none placeholder:text-gray-800 italic"
         />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredProjects.map((project) => (
          <div 
            key={project.id} 
            onClick={() => onSelectProject(project.id)}
            className={`group bg-[#0a0a0a] border rounded-[48px] p-10 flex flex-col justify-between transition-all cursor-pointer relative overflow-hidden shadow-2xl h-[340px] ${currentProjectId === project.id ? 'border-indigo-500 bg-indigo-500/[0.03] shadow-indigo-500/20 scale-[1.02]' : 'border-white/5 hover:border-white/20'}`}
          >
            <button
              onClick={(e) => { e.stopPropagation(); setConfirmId(project.id); }}
              className="absolute top-6 right-6 text-gray-700 hover:text-red-500 transition-colors"
              title="Delete workspace"
            >
              <Trash2 size={18} />
            </button>
            {currentProjectId === project.id ? (
               <div className="absolute top-8 right-8 w-3 h-3 bg-indigo-500 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.8)] animate-pulse" />
            ) : (
               <div className="absolute top-8 right-8 opacity-10 group-hover:opacity-30 transition-opacity">
                  <Cloud size={16} />
               </div>
            )}
            
            <div className="relative z-10">
              <div className="flex items-center gap-6 mb-8">
                <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center transition-all ${currentProjectId === project.id ? 'bg-indigo-600 text-white' : 'bg-white/5 text-gray-600 group-hover:bg-white group-hover:text-black'}`}>
                  <Layers size={32} />
                </div>
                <div>
                   <h4 className="text-2xl font-black text-white uppercase italic tracking-tight">{project.name}</h4>
                   <span className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-600">Established: {project.timestamp}</span>
                </div>
              </div>
              <p className="text-gray-500 text-sm font-medium leading-relaxed italic line-clamp-3 mb-6">{project.description || 'No neural context established for this node.'}</p>
            </div>

            <div className="flex items-center justify-between border-t border-white/5 pt-8 relative z-10">
               <div className="flex flex-col">
                  <span className="text-[9px] font-black uppercase tracking-widest text-gray-700 mb-1">Node Risk Level</span>
                  <span className={`text-2xl font-black ${project.riskIndex > 50 ? 'text-red-500' : 'text-emerald-500'}`}>{project.riskIndex}%</span>
               </div>
               <button className="p-4 bg-white/5 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-xl">
                  <ChevronRight size={24} />
               </button>
            </div>
          </div>
        ))}
      </div>

      {isCreating && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-8 bg-black/98 backdrop-blur-3xl animate-in fade-in duration-500">
          <div className="max-w-2xl w-full bg-[#0a0a0a] border border-white/10 rounded-[64px] p-20 relative shadow-2xl">
            <button onClick={() => setIsCreating(false)} className="absolute top-12 right-12 text-gray-500 hover:text-white transition-colors"><X size={40}/></button>
            <h2 className="text-5xl font-black mb-12 text-white uppercase italic tracking-tighter">Initialize <span className="text-indigo-500">Node.</span></h2>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-3">
                 <label className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em] ml-2">Workspace Identity</label>
                 <input 
                   type="text" 
                   required 
                   value={projectName} 
                   onChange={(e) => setProjectName(e.target.value)} 
                   placeholder="e.g. Project Orion / Client X" 
                   className="w-full bg-black border border-white/10 rounded-3xl p-7 text-white text-xl font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all italic shadow-inner" 
                   autoFocus
                 />
              </div>
              <div className="space-y-3">
                 <label className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em] ml-2">Neural Context / Scope</label>
                 <textarea 
                   value={projectDesc} 
                   onChange={(e) => setProjectDesc(e.target.value)} 
                   placeholder="Define the structural mission for this node..." 
                   className="w-full bg-black border border-white/10 rounded-3xl p-7 text-white text-lg font-medium outline-none focus:ring-2 focus:ring-indigo-500 transition-all italic shadow-inner h-40" 
                 />
              </div>
              <button type="submit" className="w-full py-7 bg-white text-black font-black rounded-[32px] text-xl uppercase tracking-tighter italic shadow-2xl hover:bg-indigo-600 hover:text-white transition-all active:scale-95">Establish Link</button>
            </form>
          </div>
        </div>
      )}

      {confirmId && (
        <div className="fixed inset-0 z-[2100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-2xl">
          <div className="w-full max-w-md bg-[#0a0a0a] border border-red-500/30 rounded-3xl p-10 space-y-6 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400">
              <AlertTriangle size={20} />
              <h3 className="text-xl font-black uppercase">Delete Workspace?</h3>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">This will remove the workspace and all linked audits. This action cannot be undone.</p>
            <div className="flex items-center justify-end gap-3">
              <button onClick={() => setConfirmId(null)} className="px-4 py-2 text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-colors">Cancel</button>
              <button onClick={() => { onDeleteProject(confirmId); setConfirmId(null); }} className="px-5 py-3 bg-red-600 text-white font-black rounded-2xl text-[11px] uppercase tracking-widest hover:bg-red-500 transition-all shadow-lg">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectHub;
