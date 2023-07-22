import React from 'react'
import { useNavigate } from 'react-router-dom';
import { Badge, Navbar, Nav, Container, NavLink, NavDropdown } from 'react-bootstrap';
import NavbarCollapse from 'react-bootstrap/esm/NavbarCollapse';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import logo from '../assets/logo.png';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import SearchBox from './SearchBox';


const Header = () => {

    const { cartItems } = useSelector((state) => state.cart);
    const { userInfo } = useSelector((state) => state.auth);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [logoutApiCall] = useLogoutMutation();

    const logoutHandler = async () => {
        try {
            await logoutApiCall().unwrap();
            dispatch(logout());
            navigate('/login');
        } catch (error) {
            console.log(error);
        }
    }

  return (
    <header>
        <Navbar bg='dark' variant='dark' expand='lg' collapseOnSelect>
        <Container>
            <LinkContainer to='/'>
                <Navbar.Brand>
                    <img src={logo} alt='ProShop'/>
                    ProShop
                </Navbar.Brand>
            </LinkContainer>  
            <Navbar.Toggle aria-controls='basic-navbar-nav'/>
            <NavbarCollapse id='basic-navbar-nav'>
                <Nav className='ms-auto'>
                    <SearchBox />
                    <LinkContainer to='/cart'>
                        <NavLink>
                            <FaShoppingCart/> Cart
                            {
                                cartItems.length > 0 && (
                                    <Badge pill bg='success' style={{marginLeft:'5px'}}>
                                        { cartItems.reduce((a, c) => a+c.qty, 0)}
                                    </Badge>
                                )
                            }
                        </NavLink>
                    </LinkContainer>
                    { userInfo ? (
                        <NavDropdown title={userInfo.name} id='username'>
                            <LinkContainer to='/profile'>
                                <NavDropdown.Item>Profile</NavDropdown.Item>
                            </LinkContainer>
                            <NavDropdown.Item onClick={logoutHandler}>
                                Logout
                            </NavDropdown.Item>
                        </NavDropdown>
                    ) : (
                        <LinkContainer to='/login'>
                            <NavLink>
                                <FaUser/> Sign In
                            </NavLink>
                        </LinkContainer>
                    )}
                    {userInfo && userInfo.isAdmin && (
                        <NavDropdown title='Admin' id='adminmenu'>
                            <LinkContainer to='/admin/productlist'>
                                <NavDropdown.Item>Products</NavDropdown.Item>
                            </LinkContainer>
                            <LinkContainer to='/admin/orderlist'>
                                <NavDropdown.Item>Orders</NavDropdown.Item>
                            </LinkContainer>
                            <LinkContainer to='/admin/userlist'>
                                <NavDropdown.Item>Users</NavDropdown.Item>
                            </LinkContainer>
                        </NavDropdown>
                    )}
                </Nav>
            </NavbarCollapse>
        </Container>
        </Navbar>
    </header>
  )
}

export default Header