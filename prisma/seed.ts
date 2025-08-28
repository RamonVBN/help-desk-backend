import { prisma } from '../src/database/prisma'

async function main() {
    await prisma.user.deleteMany()
    await prisma.called.deleteMany()
    await prisma.service.deleteMany()

    await prisma.user.create({
        data: {
            name: 'Ramon Barros',
            email: 'ramon@email.com',
            password: '$2b$08$eJz2bXdHSgbYZyyI0gttQOBp1WT93GZZUL5jDBeZWQTB9hmXyQx5W',
            role: 'ADMIN'
        }
    })

    const tech1 = await prisma.user.create({
        data: {
            name: 'Eren Jaeger',
            email: 'eren@email.com',
            password: '$2b$08$eJz2bXdHSgbYZyyI0gttQOBp1WT93GZZUL5jDBeZWQTB9hmXyQx5W',
            role: 'TECHNICIAN',
        }
    })

    const tech2 = await prisma.user.create({
        data: {
            name: 'Joseph Joestar',
            email: 'joseph@email.com',
            password: '$2b$08$eJz2bXdHSgbYZyyI0gttQOBp1WT93GZZUL5jDBeZWQTB9hmXyQx5W',
            role: 'TECHNICIAN'
        }
    })

    const tech3 = await prisma.user.create({
        data: {
            name: 'Monkey D. Luffy',
            email: 'luffy@email.com',
            password: '$2b$08$eJz2bXdHSgbYZyyI0gttQOBp1WT93GZZUL5jDBeZWQTB9hmXyQx5W',
            role: 'TECHNICIAN'
        }
    })

    await prisma.technicianInfo.create({
        data: {
            userId: tech1.id,
            availableHours: ['08:00', '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00']
        }
    })

    await prisma.technicianInfo.create({
        data: {
            userId: tech2.id,
            availableHours: ['10:00', '11:00', '12:00', '13:00', '14:00', '16:00', '17:00', '18:00', '19:00', '20:00']
        }
    })

    await prisma.technicianInfo.create({
        data: {
            userId: tech3.id,
            availableHours: ['12:00', '13:00', '14:00', '16:00', '18:00', '19:00', '20:00', '21:00', '22:00']
        }
    })

    await prisma.service.createMany({
        data: [
            {
                name: 'Instalação e atualização de softwares',
                price: 50,  
            },
            {
                name: 'Instalação e atualização de hardwares',
                price: 100,  
            },
            {
                name: 'Diagnóstico e remoção de vírus',
                price: 80,  
            },
            {
                name: 'Suporte a impressoras',
                price: 120,  
            },
            {
                name: 'Suporte a periféricos',
                price: 80,  
            },
            {
                name: 'Solução de problemas de conectividade de internet',
                price: 60,  
            },
            {
                name: 'Backup e recuperação de dados',
                price: 50,  
            },
            {
                name: 'Otimização de desempenho do sistema operacional',
                price: 70,  
            },
            {
                name: 'Configuração de VPN e Acesso Remoto',
                price: 85,  
            },
        ]
    })

    console.log('✅ Seed executado com sucesso!')
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })