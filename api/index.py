from fastapi import FastAPI, HTTPException, Header
from pydantic import BaseModel
from typing import Optional
import re

app = FastAPI()

class SubmissionData(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    message: str

def check_cybersecurity(data: SubmissionData):
    forbidden_patterns = [
        r"(?i)SELECT.*FROM",
        r"(?i)INSERT.*INTO",
        r"(?i)DROP.*TABLE",
        r"(?i)UNION.*SELECT",
        r"(?i)<script.*?>",
        r"(?i)OR.*1=1"
    ]
    
    combined_text = f"{data.name} {data.email} {data.message}"
    
    for pattern in forbidden_patterns:
        if re.search(pattern, combined_text):
            return False, f"Atividade suspeita detectada: {pattern}"
            
    return True, "Verificação concluída com sucesso"

@app.get("/api/python")
def hello_world():
    return {"message": "Hello from FastAPI on Vercel!"}

@app.post("/api/python/verify")
async def verify_submission(data: SubmissionData, x_api_key: str = Header(None)):
    if not x_api_key:
         raise HTTPException(status_code=401, detail="Missing API Key")
    
    # Em produção, valide a chave de API real aqui
    if x_api_key != "secret-key-123":
         raise HTTPException(status_code=403, detail="Invalid API Key")

    is_safe, message = check_cybersecurity(data)
    
    if not is_safe:
        return {"status": "danger", "message": message}
        
    return {"status": "success", "message": message}
