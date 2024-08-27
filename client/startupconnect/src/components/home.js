import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import "../styling/home.css";
import more from "../images/more.png";
import search from "../images/search.png";
import startup from "../images/startup2.png";
import investor from "../images/investment.png";
import arrange from "../images/arrange.png";
import rocket from "../images/kids_rocket.png";
import bulb from "../images/b2.jpg";
import techStartup from "../images/technological_startups.jpg";
import techInvestment from "../images/techInvestment2.png";
import techInvestment3 from "../images/investmentImage.jpg";

const CurveSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);
  const [startup_id, setStartup_id] = useState(null);
  const [startupsInfo, setStartupsInfo] = useState([]);
  const [sortedStartups, setSortedStartups] = useState([]);
  const [sortedInvestors, setSortedInvestors] = useState([]);
  const [startupImageClicked, setstartupImageClicked] = useState(true);
  const [investorImageClicked, setinvestorImageClicked] = useState(false);
  const [investorInfo, setinvestorInfo] = useState([]);
  const [investorId1, setinvestorId1] = useState(null);
  const [initialRender, setInitialRender] = useState(false);
  const [showMoreBar, setShowMoreBar] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const location = useLocation();
  const { userId } = location.state || {};
  console.log("USER ID MY ASS: " + userId);
  const isDisabled = !userId;

  const handleStartupImageClicked = () => {
    setstartupImageClicked(true);
    setinvestorImageClicked(false);
  };

  const handleInvestorImageClicked = () => {
    setinvestorImageClicked(true);
    setstartupImageClicked(false);
    handleInvestorSort(); // Call the sorting function here
  };

  const handleMoreClick = () => {
    setShowMoreBar(!showMoreBar); // Toggle the bar visibility
  };

  const handleViewStartupUserProfile = () => {
    navigate("/StartupUserProfile", { state: { userId } }); // Navigate to profile page
  };
  const handleViewInvestorUserProfile = () => {
    navigate("/InvestorUserProfile", { state: { userId } }); // Navigate to profile page
  };
  const handleSignUpLogin = () => {
    navigate("/Login_Signup"); // Navigate to profile page
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target); // Stop observing once visible
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://startup-connect-backend.vercel.app/startup/getAllStartups"
        );
        setStartupsInfo(response.data);
        setSortedStartups(response.data); // Initialize sortedStartups with fetched data
      } catch (error) {
        console.error(
          "Error fetching startup data:",
          error.response ? error.response.data : error.message
        );
      }
    };
    fetchData();
  }, [initialRender, startupImageClicked]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://startup-connect-backend.vercel.app/investor/getAllInvestors"
        );
        setinvestorInfo(response.data);
      } catch (error) {
        console.error(
          "Error fetching investor data:",
          error.response ? error.response.data : error.message
        );
      }
    };

    fetchData();
  }, [investorImageClicked]);

  const startupRedirect = (id) => {
    console.log("Redirecting with ID:", id);
    setStartup_id(id);
  };
  const investorRedirect = (investor_id) => {
    setinvestorId1(investor_id);
    navigate("/investorPage", {
      state: { id: investor_id, userId }, //check:'home'
    });
  };

  useEffect(() => {
    if (startup_id !== null) {
      const fetchData2 = async () => {
        try {
          // Fetch the startup data
          const response = await axios.get(
            `https://startup-connect-backend.vercel.app/getStartupId/${startup_id}`
          );
          console.log(
            "This is response.data.mostViewed before updating it: " +
              response.data.mostViewed
          );

          // Update the mostViewed count locally
          const updatedData = {
            ...response.data,
            mostViewed: response.data.mostViewed + 1,
          };
          console.log(
            "This is response.data.mostViewed after updating the value: " +
              updatedData.mostViewed
          );

          // Send the updated data to the server
          await axios.put(
            `https://startup-connect-backend.vercel.app/startup/updateStartup/${startup_id}`,
            updatedData
          );

          // Navigate to the startup page
          navigate("/startupPage", {
            state: { id: startup_id, userId }, // check:"home"
          });
        } catch (error) {
          console.log("Error fetching or updating startup:", error);
        }
      };

      fetchData2();
    }
  }, [startup_id, navigate]);

  const handleSort = () => {
    const sorted = [...startupsInfo].sort((a, b) => {
      const totalA = a.interestedInvestors.reduce(
        (sum, investor) => sum + investor.count,
        0
      );
      const totalB = b.interestedInvestors.reduce(
        (sum, investor) => sum + investor.count,
        0
      );
      return totalB - totalA;
    });

    setSortedStartups(sorted);
  };

  const handleHomeClick = () => {
    navigate("/home", { state: { userId } });
  };

  const handleInvestorSort = () => {
    console.log("Sorting investors:", investorInfo);

    const sorted = [...investorInfo].sort((a, b) => {
      const totalA = a.startupsApproached.reduce(
        (sum, startup) => sum + startup.count,
        0
      );
      const totalB = b.startupsApproached.reduce(
        (sum, startup) => sum + startup.count,
        0
      );
      return totalB - totalA;
    });

    setSortedInvestors(sorted);
  };

  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    if (query) {
      const filteredStartups = startupsInfo.filter((startup) =>
        startup.name.toLowerCase().includes(query)
      );
      setSortedStartups(filteredStartups);
    } else {
      setSortedStartups(startupsInfo);
    }
  };
  const handleSearchChangeInvestors = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    if (query) {
      const filteredInvestors = investorInfo.filter((investor) =>
        investor.investorName.toLowerCase().includes(query)
      );
      setSortedInvestors(filteredInvestors);
    } else {
      setSortedInvestors(investorInfo);
    }
  };
  const handleSearch = () => {
    if (searchQuery) {
      const filteredStartups = startupsInfo.filter((startup) =>
        startup.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSortedStartups(filteredStartups);
    } else {
      setSortedStartups(startupsInfo); // Show all startups if no query
    }
  };

  return (
    <section
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "400px",
        padding: "50px 2vw",
        background: "#f9d03c",
        color: "white",
        fontFamily: "Prompt, sans-serif",
      }}
    >
      <div className="home_container">
        <div className="search-bar">
          <div className="search-bar-input">
            {
              <input
                type="text"
                placeholder="Search"
                value={searchQuery} // Bind the search query to the input
                onChange={(e) =>
                  startupImageClicked
                    ? handleSearchChange(e)
                    : handleSearchChangeInvestors(e)
                }
              />
            }
            <img
              className="search-icon"
              src={search}
              alt="Search"
              onClick={handleSearch}
            />
          </div>
          <div className="image1Container">
            <div className="icons">
              <div className="icon-container">
                <img
                  src={arrange}
                  alt="arrange"
                  className="arrange-hover"
                  onClick={() => {
                    if (startupImageClicked) {
                      handleSort();
                    }
                    if (investorImageClicked) {
                      handleInvestorSort();
                    }
                  }}
                />

                <label>Filter</label>
              </div>
              <div className="icon-container">
                <img
                  src={startup}
                  alt="startup"
                  onClick={() => handleStartupImageClicked()}
                />
                <label>Startups</label>
              </div>
              <div className="icon-container">
                <img
                  src={investor}
                  alt="investor"
                  onClick={() => handleInvestorImageClicked()}
                />
                <label>Investors</label>
              </div>
              <div className="icon-container">
                <img src={more} alt="More" onClick={() => handleMoreClick()} />
                <label>More</label>
              </div>
            </div>
          </div>
        </div>

        {showMoreBar && (
          <div className="moreBarForNavigation">
            <button
              className="b"
              onClick={() => {
                if (!userId) {
                  Swal.fire({
                    icon: "warning",
                    title: "Not yet Signed up?",
                    text: "Sign up to register your Startup!",
                  });
                } else {
                  handleViewStartupUserProfile();
                }
              }}
            >
              Create/View your Startup
            </button>
            <button
              className="b"
              onClick={() => {
                if (!userId) {
                  Swal.fire({
                    icon: "warning",
                    title: "Not yet Signed up?",
                    text: "Sign up to register as an Investor!",
                  });
                } else {
                  handleViewInvestorUserProfile();
                }
              }}
            >
              Create/View your Investor
            </button>
            <button className="b" onClick={handleSignUpLogin}>
              Sign In / Login
            </button>
            <button
              className="b"
              onClick={() => {
                if (!userId) {
                  Swal.fire({
                    icon: "warning",
                    title: "Not yet Signed up?",
                    text: "Sign up to proceed accordingly!",
                  });
                } else {
                  handleSignUpLogin();
                }
              }}
            >
              Logout
            </button>
          </div>
        )}

        <div className="description">
          <div className="briefIntro">
            <p className="title1">StartupConnect</p>
            <img className="bulb" src={bulb} alt="Bulb" />
            <p className='bulb-attribute-artist'><a href="https://www.freepik.com/free-vector/light-bulb-hand-drawn-style_230292141.htm#fromView=search&page=2&position=15&uuid=01df716c-5265-414f-98a9-b92ca4e11451">Image by juicy_fish on Freepik</a></p>
            <p className="miniDescription1">
            This platform allows startups and investors to register and connect. Startups can find the funding they need to grow and innovate, while investors can discover promising ventures to support. Whether you're seeking investment or looking to invest, this platform fosters meaningful connections that drive success and innovation.
            </p>
          </div>
          <div className="briefIntroRocket">
            <img className="rocket" src={rocket} alt="Rocket" />
            <p className='rocket-attribute-artist'><a href="https://www.freepik.com/free-vector/child-friendly-area-abstract-concept-vector-illustration_24122477.htm#fromView=search&page=1&position=2&uuid=cd25c1ed-4551-4111-814b-aa5eadb35053">Image by vectorjuice on Freepik</a></p>
          </div>
        </div>

        <div className="gridExample">
          <div className="gridRow">
            <div className="image-container">
              <img src={techStartup} alt="Tech Startup" />
              <a
                // href="https://www.startupinsider.info/"
                className="image-link"
              >
                Register your Startup and discover Investors!
              </a>
            </div>
            <div className="image-container">
              <img src={techInvestment} alt="Tech Investment" />
              <a
                // href="https://www.investmentmagazine.com.au/"
                className="image-link"
              >
                Register as an investor and discover promising platforms to invest in!
              </a>
            </div>
            <div className="image-container">
              <img src={techInvestment3} alt="Tech Investment 3" />
              <a
                // href="https://www.pwc.co.nz/insights-and-publications/2023-publications/startup-investment-magazine-spring-2023.html"
                className="image-link"
              >
                Connect together as Investors and Startups
              </a>
            </div>
          </div>
        </div>

        {/* Conditional rendering for startups and investors */}
        {startupImageClicked && (
          <div>
            <div
              className={`startupLine ${isVisible ? "animate" : ""}`}
              ref={elementRef}
            >
              <p className="Title">Find Startups!</p>
            </div>

            <div className="flexContainer">
              {sortedStartups.length === 0 ? (
                <p>No startups available.</p>
              ) : (
                sortedStartups.map((startup, index) => {
                  const totalInterestedInvestors =
                    startup.interestedInvestors.reduce(
                      (sum, investor) => sum + investor.count,
                      0
                    );

                  return (
                    <div className="flexBox" key={index}>
                      {startup.logo && (
                        <img
                          src={`http://localhost:3000/${startup.logo}`}
                          alt="Logo"
                          style={{ height: "210px" }}
                          className="logo-image"
                        />
                      )}
                      <div style={{ marginTop: "200px" }}>
                        <h3 style={{ marginTop: "0", color: "black" }}>
                          {startup.name}
                        </h3>
                        <h4 style={{ marginTop: "8px", color: "black" }}>
                          Investors who showed interest:{" "}
                          {totalInterestedInvestors}
                        </h4>
                        <button
                          onClick={() => {
                            startupRedirect(startup._id);
                          }}
                          style={{ marginTop: "-5px" }}
                        >
                          View
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {investorImageClicked && (
          <div>
            <div
              className={`startupLine ${isVisible ? "animate" : ""}`}
              ref={elementRef}
            >
              <p className="Title">Find Investors!</p>
            </div>

            <div className="flexContainer">
              {sortedInvestors.length === 0 ? (
                <p>No investors available.</p>
              ) : (
                sortedInvestors.map((investor, index) => {
                  const totalStartupsApproached =
                    investor.startupsApproached.reduce(
                      (sum, startup) => sum + startup.count,
                      0
                    );

                  return (
                    <div className="flexBox" key={index}>
                      {investor.logo && (
                        <img
                          src={`http://localhost:3000/${investor.logo}`}
                          alt="Logo"
                          style={{ height: "210px" }}
                          className="logo-image"
                        />
                      )}
                      <div style={{ marginTop: "200px" }}>
                        <h3 style={{ marginTop: "0", color: "black" }}>
                          {investor.investorName}
                        </h3>
                        <h4 style={{ marginTop: "8px", color: "black" }}>
                          Startups Contacted: {totalStartupsApproached}
                        </h4>
                        <button
                          onClick={() => {
                            investorRedirect(investor._id);
                          }}
                          style={{ marginTop: "-5px" }}
                        >
                          View
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
      <div
        style={{
          position: "absolute",
          height: "250px",
          width: "100%",
          bottom: 0,
        }}
      >
        <div
          style={{
            content: '""',
            display: "block",
            position: "absolute",
            borderRadius: "70% 54%",
            width: "52%",
            height: "94%",
            backgroundColor: "#FFFFFF",
            transform: "translate(92%, 60%)",
          }}
        ></div>
        <div
          style={{
            content: '""',
            display: "block",
            position: "absolute",
            borderRadius: "100% 50%",
            width: "53%",
            height: "102%",
            backgroundColor: "#f9d03c",
            transform: "translate(-4%, 40%)",
            zIndex: -1,
          }}
        ></div>
      </div>
    </section>
  );
};

export default CurveSection;
