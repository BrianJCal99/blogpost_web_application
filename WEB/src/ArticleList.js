import { faker } from '@faker-js/faker';
import uniqid from 'uniqid'



const articleList = [
    {
        id: uniqid(),
        cover: "https://picsum.photos/200?random=1",
        title: faker.random.words(5),
        description: faker.random.words(10),
        rating: faker.random.numeric(),
        authour: faker.name.fullName(),
    },
    {
        id: uniqid(),
        cover: "https://picsum.photos/200?random=2",
        title: faker.random.words(5),
        description: faker.random.words(10),
        rating: faker.random.numeric(),
        authour: faker.name.fullName(),
    },
    {
        id: uniqid(),
        cover: "https://picsum.photos/200?random=3",
        title: faker.random.words(5),
        description: faker.random.words(10),
        rating: faker.random.numeric(),
        authour: faker.name.fullName(),
    },
]

export default articleList;