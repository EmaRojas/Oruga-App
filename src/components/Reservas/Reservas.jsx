import { Card, Button, Row,Col } from 'react-bootstrap';

export const Reservas = () => {
    const obj =
        [
            {
                nombre: "sala1",
                cantidad: 6
            },
            {
                nombre: "sala2",
                cantidad: 6
            },
            {
                nombre: "sala3",
                cantidad: 6
            },
            {
                nombre: "sala4",
                cantidad: 6
            },
            {
                nombre: "sala5",
                cantidad: 6
            },
            {
                nombre: "sala6",
                cantidad: 6
            }
        ];

    return (
        <Row xs={1} md={3} className="g-3">
            {
                obj.map(({ nombre, cantidad },idx) => (
                    <Col key={idx}>
                        <Card  style={{ width: '18rem' }}>
                            <Card.Body>
                                <Card.Title>{nombre}</Card.Title>
                                <Card.Text>
                                    {cantidad}
                                </Card.Text>
                                <Button variant="primary">Reservar</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))
            }
        </Row>
    )
}
