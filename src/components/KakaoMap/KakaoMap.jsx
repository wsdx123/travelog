import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import * as S from "./KakaoMap.style";

const {kakao} = window

const KakaoMap = ({ onChange }) => {
  const mapRef = useRef();
  const geocoderRef = useRef();
  const placesRef = useRef();
  const overlayRef = useRef();
  const [keyword, setKeyword] = useState("");
  const [placeResult, setPlaceResult] = useState(null);
  const [addressResult, setAddressResult] = useState(null);
  const [coordsResult, setCoordsResult] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [menu, setMenu] = useState("place");

  useEffect(()=>{
    console.log(selectedPlace)
  },[selectedPlace])

  const openOverlay = useCallback(
    (title, position) => {
      console.log(position)
      const overlayPosition = new kakao.maps.LatLng(
        position.latitude,
        position.longitude
      );
      const content = `<div class='customOverlay'>${title}</div>`;
      overlayRef.current.setContent(content);
      overlayRef.current.setPosition(overlayPosition);
      overlayRef.current.setVisible(true);
      mapRef.current.setLevel(3);
      mapRef.current.panTo(overlayPosition);
    },
    [overlayRef, mapRef]
  );

  function handleKeyDownInput(e) {
    if(e.keyCode === 13) {
      e.preventDefault()
      searchPlaces()
    }
  }

  function searchPlaces() {
    if (!keyword.replace(/^\s+|\s+$/g, "")) {
      alert("키워드를 입력해주세요.");
      return false;
    }
    console.log("keyword: ", keyword);
    placesRef.current.keywordSearch(keyword, placesSearchCB);
    geocoderRef.current.addressSearch(keyword, addressSearchCB, { size: 30 });
  }

  function handleSubmit(e) {
    e.preventDefault();
    searchPlaces();
  }

  function setBoundary(placeList) {
    const bounds = new kakao.maps.LatLngBounds();
    for (let i = 0; i < placeList.length; i++) {
      const placePosition = new kakao.maps.LatLng(
        placeList[i].latitude,
        placeList[i].longitude
      );
      bounds.extend(placePosition);
    }
    mapRef.current.setBounds(bounds);
  }

  const coordsSearchCB = useCallback(
    (data, status) => {
      if (status === kakao.maps.services.Status.OK) {
        const result = data.map((address) => ({
          name: address.address_name,
          longitude: address.x,
          latitude: address.y,
        }));
        setCoordsResult(result);
        setMenu("coords");
      }
    },
    [setCoordsResult, setMenu]
  );

  function placesSearchCB(data, status) {
    console.log(status);
    if (status === kakao.maps.services.Status.OK) {
      console.log("place");
      const result = data.map((place) => ({
        name: place.place_name,
        longitude: place.x,
        latitude: place.y,
      }));
      console.log(data);
      setPlaceResult(result); // 성공시 장소 표시
    } else if (status === kakao.maps.services.Status.ERROR) {
      alert("검색 결과 중 오류가 발생했습니다.");
      return;
    }
  }

  function addressSearchCB(data, status) {
    if (status === kakao.maps.services.Status.OK) {
      console.log("address");
      const result = data.map((address) => ({
        name: address.address_name,
        longitude: address.x,
        latitude: address.y,
      }));
      console.log(result);
      setAddressResult(result);
    } else if (status === kakao.maps.services.Status.ERROR) {
      alert("검색 결과 중 오류가 발생했습니다.");
      return;
    }
  }

  const getUserPosition = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { longitude, latitude } = position.coords;
        setCurrentPosition({
          name: "현재 위치",
          longitude: longitude,
          latitude: latitude,
        });

        openOverlay("현재 위치", { longitude: longitude, latitude: latitude });
        geocoderRef.current.coord2RegionCode(
          longitude,
          latitude,
          coordsSearchCB
        );
      });
    } else {
      setCurrentPosition({ longitude: 126.978652258309, latitude : 37.566826004661 });
    }
  }, [setCurrentPosition, openOverlay, geocoderRef, coordsSearchCB]);

  useEffect(() => {
    if (selectedPlace) {
      console.log(selectedPlace)
      openOverlay(selectedPlace.name, {
        longitude: selectedPlace.longitude,
        latitude: selectedPlace.latitude,
      });
      onChange(selectedPlace);
    }
  }, [selectedPlace, onChange, openOverlay]);

  useEffect(() => {
    console.log("menu: ", menu);
    if (menu === "place" && placeResult) setBoundary(placeResult);
    if (menu === "address" && addressResult) setBoundary(addressResult);
  }, [menu, placeResult, addressResult]);

  useLayoutEffect(() => {
    kakao.maps.load(function () {
      const container = document.getElementById("map");
      const position = new kakao.maps.LatLng(
        36.48211492948262,
        127.7762755344892
      );
      const options = {
        center: position,
        level: 13,
      };
      const map = new kakao.maps.Map(container, options);
      const overlay = new kakao.maps.CustomOverlay({
        position: position,
        content: "<div class='customOverlay'></div>",
        clickable: true,
        zIndex: 1,
        map: map,
      });
      overlay.setMap(map);
      const places = new kakao.maps.services.Places();
      const geocoder = new kakao.maps.services.Geocoder();
      mapRef.current = map;
      overlayRef.current = overlay;
      placesRef.current = places;
      geocoderRef.current = geocoder;
      getUserPosition();
    });
  }, [getUserPosition]);

  return (
    <>
      <S.MapWrapper className="map_wrap">
        <div
          id="map"
          style={{ width: "400px", height: "400px", borderRadius: "10px" }}
        >
          <S.GetPositionIcon onClick={() => getUserPosition()}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="#000000"
              viewBox="0 0 256 256"
            >
              <path
                d="M128,24a80,80,0,0,0-80,80c0,72,80,128,80,128s80-56,80-128A80,80,0,0,0,128,24Zm0,112a32,32,0,1,1,32-32A32,32,0,0,1,128,136Z"
                opacity="0.2"
              ></path>
              <path d="M128,64a40,40,0,1,0,40,40A40,40,0,0,0,128,64Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,128Zm0-112a88.1,88.1,0,0,0-88,88c0,31.4,14.51,64.68,42,96.25a254.19,254.19,0,0,0,41.45,38.3,8,8,0,0,0,9.18,0A254.19,254.19,0,0,0,174,200.25c27.45-31.57,42-64.85,42-96.25A88.1,88.1,0,0,0,128,16Zm0,206c-16.53-13-72-60.75-72-118a72,72,0,0,1,144,0C200,161.23,144.53,209,128,222Z"></path>
            </svg>
          </S.GetPositionIcon>
        </div>

        {menu === "place" &&
          placeResult?.map((place, i) => (
            <Marker key={i} map={mapRef.current} place={place} />
          ))}
        {menu === "address" &&
          addressResult?.map((place, i) => (
            <Marker key={i} map={mapRef.current} place={place} />
          ))}
        {menu === "coords" &&
          [currentPosition, ...coordsResult].map((place, i) => (
            <Marker key={i} map={mapRef.current} place={place} />
          ))}
        <S.MenuWrapper id="menu_wrap">
          <S.DisplaySelectedPlace>
            <div style={{}}>선택된 장소:</div>
            {selectedPlace && selectedPlace.name}
          </S.DisplaySelectedPlace>
          <form onSubmit={handleSubmit}>
            <S.FormInner>
              <label htmlFor="keyword">키워드 :</label>
              <S.StyledInput
                type="text"
                name="keyword"
                id="keyword"
                value={keyword}
                onKeyDown={handleKeyDownInput}
                onChange={(e) => setKeyword(e.target.value)}
              />
              <S.StyledButton type="submit">찾기</S.StyledButton>
            </S.FormInner>
          </form>
          <S.TabMenu>
            <S.TabMenuItem
              isSelected={(menu === "place").toString()}
              type="button"
              onClick={() => setMenu("place")}
            >
              장소
            </S.TabMenuItem>
            <S.TabMenuItem
              isSelected={(menu === "address").toString()}
              type="button"
              onClick={() => setMenu("address")}
            >
              지역
            </S.TabMenuItem>
            <S.TabMenuItem
              isSelected={(menu === "coords").toString()}
              type="button"
              onClick={() => setMenu("coords")}
            >
              현재 위치
            </S.TabMenuItem>
          </S.TabMenu>
          {
            <PlacesList
              places={
                menu === "place"
                  ? placeResult
                  : menu === "address"
                  ? addressResult
                  : [currentPosition, ...coordsResult]
              }
              selectPlace={setSelectedPlace}
              selectedPlace={selectedPlace}
            />
          }
        </S.MenuWrapper>
      </S.MapWrapper>
    </>
  );
};

function PlacesList({ places, selectPlace, selectedPlace }) {
  console.log(places);
  return (
    <S.StyledList id="placesList">
      {places &&
        places.map((place, i) => (
          <S.StyledListItem
            key={i}
            onClick={() =>
              selectPlace({ name: place.name, longitude: parseFloat(place.longitude), latitude: parseFloat(place.latitude ) })
            }
            isSelected={place.name === selectedPlace?.name}
          >
            {place.name}
          </S.StyledListItem>
        ))}
    </S.StyledList>
  );
}

function Marker({ map, place }) {
  useEffect(() => {
    const markerPosition = new kakao.maps.LatLng(place.y, place.x);
    const marker = new kakao.maps.Marker({
      position: markerPosition,
      clickable: true,
    });
    marker.setMap(map);
    return () => marker.setMap(null);
  }, [map, place]);
  return null;
}

export default KakaoMap;
