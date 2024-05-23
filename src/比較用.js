import React, { useState } from 'react';
import './WeatherComparison.css';  // CSSファイルをインポート

const WeatherComparison = () => {
  // 複数の都市名を管理する状態
  const [cities, setCities] = useState(['']);
  // 各都市の天気データを管理する状態
  const [weatherData, setWeatherData] = useState([]);
  // エラーメッセージを管理する状態
  const [error, setError] = useState('');

  // OpenWeatherMapから取得したAPIキー
  const OPENWEATHERMAP_API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY';

  // 新しい都市入力フィールドを追加する関数
  const addCityInput = () => {
    setCities([...cities, '']);
  };

  // 都市名の変更をハンドリングする関数
  const handleCityChange = (index, value) => {
    const newCities = cities.slice();
    newCities[index] = value;
    setCities(newCities);
  };

  // 都市入力フィールドを削除する関数
  const removeCityInput = (index) => {
    const newCities = cities.slice();
    newCities.splice(index, 1);
    setCities(newCities);
  };

  // 天気情報を取得する関数
  const getWeather = async (e) => {
    e.preventDefault(); // フォームのデフォルトの送信動作を防ぐ
    setError(''); // エラーメッセージをリセット
    setWeatherData([]); // 天気データをリセット
    try {
      // 各都市の天気データを非同期に取得
      const data = await Promise.all(
        cities.map(async (city) => {
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPENWEATHERMAP_API_KEY}&units=metric&lang=ja`
          );
          if (!response.ok) {
            throw new Error(`都市 ${city} が見つかりません。`);
          }
          return response.json(); // 天気データをJSON形式で返す
        })
      );
      setWeatherData(data); // 取得した天気データを状態に設定
    } catch (error) {
      setError(error.message); // エラーメッセージを状態に設定
    }
  };

  return (
    <div className="container">
      <h1>天気比較アプリ</h1>
      <form onSubmit={getWeather}>
        {cities.map((city, index) => (
          <div className="input-group" key={index}>
            <input
              type="text"
              placeholder="都市名を入力"
              value={city}
              onChange={(e) => handleCityChange(index, e.target.value)}
            />
            {cities.length > 1 && (
              <button
                type="button"
                className="delete-button"
                onClick={() => removeCityInput(index)}
              >
                削除
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={addCityInput}>都市を追加</button>
        <button type="submit">検索</button>
      </form>
      {error && <p className="error">{error}</p>}
      {weatherData.length > 0 && (
        <div className="weather-info">
          <h2>天気比較</h2>
          {weatherData.map((weather, index) => (
            <div key={index}>
              <h3>{weather.name}の天気</h3>
              <p>気温: {weather.main.temp}°C</p>
              <p>天気: {weather.weather[0].description}</p>
              <p>湿度: {weather.main.humidity}%</p>
              <p>風速: {weather.wind.speed} m/s</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WeatherComparison;
