import React, {Component} from 'react';
import AuthService from "../services/AuthService";

class SidebarComponent extends Component {
    render() {
        return (

            <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion"
                id="accordionSidebar">
                {/* Sidebar - Brand */}
                <a className="sidebar-brand d-flex align-items-center justify-content-center"
                   href="index.html">
                    <div className="sidebar-brand-icon rotate-n-15">
                        <i className="fas fa-laugh-wink"/>
                    </div>
                    <div className="sidebar-brand-text mx-3">ChaosNet <sup>v0</sup></div>
                </a>
                {/* Divider */}
                <hr className="sidebar-divider my-0"/>
                {/* Nav Item - Dashboard */}
                <li className="nav-item active">
                    <a className="nav-link" href="/">
                        <i className="fas fa-fw fa-tachometer-alt"/>
                        <span>Home</span></a>
                </li>

                {/* Divider */}
                <hr className="sidebar-divider"/>
                {/* Heading */}
                <div className="sidebar-heading">
                    Projects
                </div>
                {/* Nav Item - Pages Collapse Menu */}
                <li className="nav-item">
                    <a className="nav-link collapsed" href="#" data-toggle="collapse"
                       data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                        <i className="fas fa-fw fa-cog"/>
                        <span>ChaosNet</span>
                    </a>
                    <div id="collapseOne" className="collapse" aria-labelledby="headingOne"
                         data-parent="#accordionSidebar">
                        <div className="bg-white py-2 collapse-inner rounded">
                            <h6 className="collapse-header">ChaosNet:</h6>
                            {
                                AuthService.userData ?
                                <a className="collapse-item" href={"/" + AuthService.userData.username + "/trainingrooms"}>Training Rooms</a> :
                                <a className="collapse-item" href="/trainingrooms">Training Rooms</a>
                            }
                            {
                                AuthService.userData && AuthService.userData._isAdmin ?
                                <a className="collapse-item" href={"/" + AuthService.userData.username + "/simmodels"}>Sim Models</a> :
                                <a className="collapse-item" href={"/simmodels"}>Sim Models</a>
                            }
                            <a href="https://github.com/schematical/chaoscraft-mod/wiki"  className="collapse-item">ChaosCraft Wiki</a>
                            <a href="https://github.com/schematical/chaoscraft-mod"  className="collapse-item">Github</a>

                        </div>
                    </div>


                    <a className="nav-link collapsed" href="#" data-toggle="collapse"
                       data-target="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">
                        <i className="fas fa-brush"></i>
                        <span>ChaosPixel</span>
                    </a>
                    <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo"
                         data-parent="#accordionSidebar">
                        <div className="bg-white py-2 collapse-inner rounded">
                            <h6 className="collapse-header">ChaosPixel:</h6>
                            <a className="collapse-item" href="/chaospixel">Home</a>
                            <a className="collapse-item" href="/chaospixel/slicer">Slicer</a>
                        </div>
                    </div>
                </li>


                <li className="nav-item active">
                    <a className="nav-link" href="https://www.patreon.com/bePatron?u=12320615">
                        <i className="fab fa-patreon"></i>
                        <span>Support Us</span></a>
                </li>
                <li className="nav-item active">
                    <a className="nav-link" href="https://discord.gg/Bqzy9ua">
                        <i className="fab fa-discord"></i>
                        <span>Discord</span></a>
                </li>
                <li className="nav-item active">
                    <a className="nav-link" href="https://www.youtube.com/schematical">
                        <i className="fab fa-youtube"></i>
                        <span>Youtube</span></a>
                </li>
                <li className="nav-item active">
                    <a className="nav-link" href="https://www.twitch.tv/schematicalgames">
                        <i className="fab fa-twitch"></i>
                        <span>Twitch</span></a>
                </li>
                <li className="nav-item active">
                    <a className="nav-link" href="https://github.com/schematical">
                        <i className="fab fa-github"></i>
                        <span>Github</span></a>
                </li>
                <li className="nav-item active">
                    <a className="nav-link" href="https://trello.com/b/THugAw4z/schematical-public">
                        <i className="fab fa-trello"></i>
                        <span>Trello</span></a>
                </li>
                <li className="nav-item active">
                    <a className="nav-link" href="https://twitter.com/schematical">
                        <i className="fab fa-twitter"></i>
                        <span>Twitter</span></a>
                </li>

{/*
                 Divider
                <hr className="sidebar-divider"/>
                 Heading
                <div className="sidebar-heading">
                    Interface
                </div>
                 Nav Item - Pages Collapse Menu
                <li className="nav-item">
                    <a className="nav-link collapsed" href="#" data-toggle="collapse"
                       data-target="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">
                        <i className="fas fa-fw fa-cog"/>
                        <span>Components</span>
                    </a>
                    <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo"
                         data-parent="#accordionSidebar">
                        <div className="bg-white py-2 collapse-inner rounded">
                            <h6 className="collapse-header">Custom Components:</h6>
                            <a className="collapse-item" href="buttons.html">Buttons</a>
                            <a className="collapse-item" href="cards.html">Cards</a>
                        </div>
                    </div>
                </li>
                 Nav Item - Utilities Collapse Menu
                <li className="nav-item">
                    <a className="nav-link collapsed" href="#" data-toggle="collapse"
                       data-target="#collapseUtilities" aria-expanded="true"
                       aria-controls="collapseUtilities">
                        <i className="fas fa-fw fa-wrench"/>
                        <span>Utilities</span>
                    </a>
                    <div id="collapseUtilities" className="collapse" aria-labelledby="headingUtilities"
                         data-parent="#accordionSidebar">
                        <div className="bg-white py-2 collapse-inner rounded">
                            <h6 className="collapse-header">Custom Utilities:</h6>
                            <a className="collapse-item" href="utilities-color.html">Colors</a>
                            <a className="collapse-item" href="utilities-border.html">Borders</a>
                            <a className="collapse-item" href="utilities-animation.html">Animations</a>
                            <a className="collapse-item" href="utilities-other.html">Other</a>
                        </div>
                    </div>
                </li>
                 Divider
                <hr className="sidebar-divider"/>
                 Heading
                <div className="sidebar-heading">
                    Addons
                </div>
                 Nav Item - Pages Collapse Menu
                <li className="nav-item">
                    <a className="nav-link collapsed" href="#" data-toggle="collapse"
                       data-target="#collapsePages" aria-expanded="true" aria-controls="collapsePages">
                        <i className="fas fa-fw fa-folder"/>
                        <span>Pages</span>
                    </a>
                    <div id="collapsePages" className="collapse" aria-labelledby="headingPages"
                         data-parent="#accordionSidebar">
                        <div className="bg-white py-2 collapse-inner rounded">
                            <h6 className="collapse-header">Login Screens:</h6>
                            <a className="collapse-item" href="login.html">Login</a>
                            <a className="collapse-item" href="register.html">Register</a>
                            <a className="collapse-item" href="forgot-password.html">Forgot Password</a>
                            <div className="collapse-divider"/>
                            <h6 className="collapse-header">Other Pages:</h6>
                            <a className="collapse-item" href="404.html">404 Page</a>
                            <a className="collapse-item" href="blank.html">Blank Page</a>
                        </div>
                    </div>
                </li>
                 Nav Item - Charts
                <li className="nav-item">
                    <a className="nav-link" href="charts.html">
                        <i className="fas fa-fw fa-chart-area"/>
                        <span>Charts</span></a>
                </li>
                 Nav Item - Tables
                <li className="nav-item">
                    <a className="nav-link" href="tables.html">
                        <i className="fas fa-fw fa-table"/>
                        <span>Tables</span></a>
                </li>
                 Divider
                <hr className="sidebar-divider d-none d-md-block"/>
                 Sidebar Toggler (Sidebar)
                <div className="text-center d-none d-md-inline">
                    <button className="rounded-circle border-0" id="sidebarToggle">
                        s
                    </button>
                </div>*/}
            </ul>

        );
    }
}

export default SidebarComponent;