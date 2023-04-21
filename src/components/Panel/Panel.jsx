import { NavB } from '../Nav/Nav'
import { Container } from "react-bootstrap"
import { Reservas } from '../Reservas/Reservas'

export const Panel = () => {
    return (
        <>
            <NavB />
            <Container fluid className='pt-5'>
            <Reservas />
            </Container>
        </>
    )
}
