import React from 'react'

export const DataContext = React.createContext();

export const DataProvider = ({ children }) => {

    const [liveData, setLiveData] = React.useState(null);
    const [historyData, setHistoryData] = React.useState(null);
    const [dataLoaded, setDataLoaded] = React.useState(false);
    const [previousData, setPreviousData] = React.useState(null);

    const fetchData = () => {

        fetch('http://localhost:5000/api/live')
            .then(res => res.json())
            .then(json => {

                    setLiveData(json.data);
                    setPreviousData(json.previous);

            })
            .catch(err => console.error('Fetch error:', err));

        fetch('http://localhost:5000/api/history')
            .then(res => res.json())
            .then(json => {
                if (Array.isArray(json) && json.length > 0) setHistoryData(json[0]);
            })
            .catch(err => console.error('Fetch error:', err));

    };

    return (
        <DataContext.Provider value={{
            fetchData,
            data: {
                live: liveData,
                history: historyData,
                previous: previousData,
            },
            setDataLoaded,
            dataLoaded,
        }}>
            {children}
        </DataContext.Provider>
    )

}