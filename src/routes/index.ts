import { Router } from 'express';
import { uuid } from 'uuidv4';

const routes = Router();

interface User {
    id: string,
    nome: string,
    nascimento: string,
    CPF: number,
    phone: number,
    created: Date,
    updated: Date
}
interface Piu {
    id: string,
    userId: string,
    text: string,
    created: Date,
    updated: Date
}

const users = [] as User[];
const pius = [] as Piu[];

routes.post('/users', (request, response)=>{
    const { id, nome, nascimento, CPF, phone} = request.body;

    if(users.find(user => user.CPF === CPF))
        return response.status(400).json({message: "Social number already registered"});
    if(nome == null)
        return response.status(400).json({message: "Please enter a name"});
    if(nascimento == null)
        return response.status(400).json({message: "Please enter date of birth"});
    if(CPF == null)
        return response.status(400).json({message: "Please enter a social number"});
    if(phone == null)
        return response.status(400).json({message: "Please enter a phone number"});



    const user = {
        id: uuid(),
        nome,
        nascimento,
        CPF,
        phone,
        created: new Date(),
        updated: new Date()
    } as User;

    users.push(user);
    return response.json(user);
});

routes.post('/pius', (request, response)=>{
    const { id, userId, text} = request.body;

    const userIndex = users.findIndex(user => user.id === userId);
    if(userIndex === -1)
        return response.status(404).json({message: "User not found!"});

    if(text.length === 0)
        return response.status(400).json({message: "Cannot send Null Pius"});
    if(text.length > 140)
        return response.status(400).json({message: "Cannot send Pius with more than 140 caracters"});
    if(!userId)
        return response.status(400).json({ message: "User not found"});

    const piu = {
        id: uuid(),
        userId,
        text,
        created: new Date(),
        updated: new Date()
    } as Piu;
    pius.push(piu);
    return response.json(piu);
});

routes.get('/users', (request, response) =>{
    return response.json(users)
}) ;

routes.get('/pius', (request, response)=>{
    return response.json(pius);
});

routes.get('/users/:id', (request, response)=>{
    const { id } = request.params;

    const user = users.find( user => user.id === id);

    if(!user)
        return response.status(400).json({ message: "User not found"});

    return response.json(user);
});
routes.get('/pius/:id', (request, response)=>{
    const { id } = request.params;

    const piu = pius.find( piu => piu.id === id);

    if(!piu)
        return response.status(400).json({ message: "Piu not found"});

    return response.json(piu);
});
routes.delete('/users/:id', (request, response)=>{
    const { id } = request.params;

    const userIndex = users.findIndex(user => user.id === id);

    if(userIndex === -1)
        return response.status(404).json({message: "User not found!"});
    
    users.splice(userIndex, 1);

    return response.json();
});
routes.delete('/pius/:id', (request, response)=>{
    const { id } = request.params;

    const piuIndex = pius.findIndex(piu => piu.id === id);

    if(piuIndex === -1)
        return response.status(404).json({message: "Piu not found!"});
    
    pius.splice(piuIndex, 1);

    return response.json({message: "Deleted!"});
});
routes.put('/users/:id', (request, response)=>{
    const { id } = request.params;
    const {nome, nascimento, CPF, phone} = request.body;

    const userIndex = users.findIndex(user => user.id === id);

    const userCpf = users.find(user => user.CPF === CPF && user.id != id);

    if(userCpf)
        return response.status(400).json({message: "This social number is already registered"});
    
    if(userIndex === -1)
        return response.status(404).json({message: "User not found!"});
    if(nome == null)
        return response.status(400).json({message: "Please enter a name"});
    if(nascimento == null)
        return response.status(400).json({message: "Please enter date of birth"});
    if(CPF == null)
        return response.status(400).json({message: "Please enter a social number"});
    if(phone == null)
        return response.status(400).json({message: "Please enter a phone number"});    

    users[userIndex].CPF = CPF;
    users[userIndex].nome = nome;
    users[userIndex].phone = phone;
    users[userIndex].nascimento = nascimento;

    return response.json(users[userIndex]);
});
routes.put('/pius/:id', (request, response)=>{
    const { id } = request.params;
    const { text } = request.body;
    
    if(text.length === 0)
        return response.status(400).json({message: "Cannot send Null Pius"});
    if(text.length > 140)
        return response.status(400).json({message: "Cannot send Pius with more than 140 caracters"});

    const piuIndex = pius.findIndex(user => user.id === id);

    if(piuIndex === -1)
        return response.status(404).json({message: "Piu not found!"});

    pius[piuIndex].text = text;
    
    return response.json(pius[piuIndex]);
});

export default routes;
