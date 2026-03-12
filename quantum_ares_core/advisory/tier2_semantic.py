import os
import chromadb
from typing import Dict, Any, List, Optional

class SemanticAdvisor:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(SemanticAdvisor, cls).__new__(cls)
            cls._instance.model = None
            cls._instance.db_client = None
            cls._instance.collection = None
        return cls._instance

    def initialize(self):
        if self.model is None:
            try:
                print("Loading sentence-transformers (all-MiniLM-L6-v2)...")
                from sentence_transformers import SentenceTransformer
                self.model = SentenceTransformer('all-MiniLM-L6-v2')
            except Exception as e:
                print(f"Optional service sentence-transformers failed to start: {e}")
            
        if self.db_client is None:
            try:
                persist_dir = os.path.join(os.path.dirname(__file__), "..", "data", "chroma_db")
                self.db_client = chromadb.PersistentClient(path=persist_dir)
                self.collection = self.db_client.get_or_create_collection(name="compliance_docs")
                
                if self.collection.count() == 0 and self.model is not None:
                    self._seed_knowledge_base()
            except Exception as e:
                print(f"Optional service chromadb failed to start: {e}")

    def _seed_knowledge_base(self):
        # Placeholder documents for RAG
        documents = [
            "NIST SP 800-207: Zero Trust Architecture requires no implicit trust by network location.",
            "DPDP Act 2023 Section 8(4): Data should be protected by design and default settings.",
            "RBI IT Master Direction 7.2: Access control should be strictly role-based and periodic review conducted.",
            "MITRE T1046: Network Service Scanning is often used by adversaries to find ingress points.",
            "MITRE T1190: Exploit Public-Facing Application to gain initial access.",
            "NIST SP 800-207: Monitoring and logging should be pervasive across all zero-trust resources.",
            "DPDP Act 2023 Section 6(1): Personal data shall be processed only for the purpose specified.",
            "Quantum Risk: RSA-2048 and ECC are vulnerable to decryption by Shor's algorithm on a CRYPTOGRAPHICALLY RELEVANT QUANTUM COMPUTER (CRQC).",
            "NVIDIA/Cisco/Microsoft: Recommend migrating to ML-KEM and ML-DSA post-quantum algorithms by 2025-2030."
        ]
        metadatas = [{"source": "NIST"}, {"source": "DPDP"}, {"source": "RBI"}, {"source": "MITRE"}, {"source": "MITRE"}, {"source": "NIST"}, {"source": "DPDP"}, {"source": "Quantum Research"}, {"source": "Industry Standards"}]
        ids = [f"id_{i}" for i in range(len(documents))]
        
        embeddings = self.model.encode(documents).tolist()
        self.collection.add(
            ids=ids,
            embeddings=embeddings,
            documents=documents,
            metadatas=metadatas
        )

    def search(self, question: str) -> Dict[str, Any]:
        if not self.model or not self.collection: 
            self.initialize()
            
        if not self.model or not self.collection:
            return {
                "answer": "Semantic search is currently disabled because the AI advisor model or database failed to load.",
                "tier": 2,
                "badge": "Semantic ⚠️",
                "sources": []
            }
        
        query_embedding = self.model.encode([question]).tolist()
        results = self.collection.query(
            query_embeddings=query_embedding,
            n_results=3
        )
        
        answer = f"Based on {results['metadatas'][0][0]['source']}: {results['documents'][0][0]}"
        sources = list(set([m['source'] for m in results['metadatas'][0]]))
        
        return {
            "answer": answer,
            "tier": 2,
            "badge": "Semantic 🔍",
            "sources": sources
        }
