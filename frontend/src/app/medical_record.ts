export class MedicalRecord {
  constructor(
    public date: string,
    public hemogram: number,
    public urea: number,
    public creatine: number,
    public ALT: number,
    public AST: number,
    public assignedTo: string
 ) {
    }
  
}
