mariadb에 있는 데이터를 자바 코드로 조회 한 후에 일정한 형식으로 프론트에 띄우고 싶어
ChatGPT
MariaDB에서 데이터를 조회하고 이를 Java 코드로 프론트엔드에 전달하기 위한 기본적인 흐름을 설명해드리겠습니다. 이 과정에는 다음 단계가 포함됩니다:

MariaDB 데이터베이스와의 연결 설정
데이터 조회를 위한 SQL 쿼리 작성
조회된 데이터를 일정한 형식으로 가공
가공된 데이터를 프론트엔드로 전달
아래는 각 단계를 구현하기 위한 샘플 코드를 포함한 설명입니다.

1. MariaDB 데이터베이스 연결 설정
   우선, MariaDB와 연결하기 위해 JDBC 드라이버를 사용해야 합니다. Maven을 사용하여 프로젝트를 관리하는 경우, pom.xml 파일에 MariaDB JDBC 드라이버를 추가합니다.

xml
Copy code
<dependency>
<groupId>org.mariadb.jdbc</groupId>
<artifactId>mariadb-java-client</artifactId>
<version>2.7.3</version>
</dependency>
2. 데이터 조회를 위한 SQL 쿼리 작성
   다음으로, Java에서 MariaDB에 연결하고 데이터를 조회하는 코드를 작성합니다.

java
Copy code
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

// 데이터 모델 클래스
class Restaurant {
private int id;
private String name;
private String address;
private double rating;

    // 생성자, getter, setter
    public Restaurant(int id, String name, String address, double rating) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.rating = rating;
    }

    // Getters and Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public double getRating() {
        return rating;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }
}

public class DatabaseConnector {
private static final String URL = "jdbc:mariadb://localhost:3306/your_database";
private static final String USER = "your_username";
private static final String PASSWORD = "your_password";

    public List<Restaurant> getRestaurants() {
        List<Restaurant> restaurants = new ArrayList<>();
        try (Connection connection = DriverManager.getConnection(URL, USER, PASSWORD)) {
            String query = "SELECT id, name, address, rating FROM restaurants";
            try (PreparedStatement statement = connection.prepareStatement(query);
                 ResultSet resultSet = statement.executeQuery()) {
                while (resultSet.next()) {
                    int id = resultSet.getInt("id");
                    String name = resultSet.getString("name");
                    String address = resultSet.getString("address");
                    double rating = resultSet.getDouble("rating");
                    restaurants.add(new Restaurant(id, name, address, rating));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return restaurants;
    }
}
3. 가공된 데이터를 일정한 형식으로 가공
   조회된 데이터를 프론트엔드로 전달하기 위해 JSON 형식으로 변환합니다. 이를 위해 라이브러리인 Gson을 사용할 수 있습니다. Maven에서 Gson을 추가합니다.

xml
Copy code
<dependency>
<groupId>com.google.code.gson</groupId>
<artifactId>gson</artifactId>
<version>2.8.8</version>
</dependency>
java
Copy code
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

public class DataFormatter {
public String convertToJson(List<Restaurant> restaurants) {
Gson gson = new GsonBuilder().setPrettyPrinting().create();
return gson.toJson(restaurants);
}
}
4. 가공된 데이터를 프론트엔드로 전달
   서블릿을 사용하여 데이터를 프론트엔드로 전달할 수 있습니다. 아래는 간단한 서블릿 예제입니다.

java
Copy code
import java.io.IOException;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/restaurants")
public class RestaurantServlet extends HttpServlet {
private static final long serialVersionUID = 1L;

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        DatabaseConnector dbConnector = new DatabaseConnector();
        List<Restaurant> restaurants = dbConnector.getRestaurants();

        DataFormatter formatter = new DataFormatter();
        String json = formatter.convertToJson(restaurants);

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(json);
    }
}
프론트엔드에서 데이터 받아오기
이제 프론트엔드에서 서블릿을 통해 데이터를 가져올 수 있습니다. 예를 들어, JavaScript를 사용하여 데이터를 가져오고 이를 화면에 표시할 수 있습니다.

html
Copy code
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Restaurants</title>
</head>
<body>
    <div id="restaurant-list"></div>

    <script>
        fetch('/restaurants')
            .then(response => response.json())
            .then(data => {
                const restaurantList = document.getElementById('restaurant-list');
                data.forEach(restaurant => {
                    const div = document.createElement('div');
                    div.textContent = `Name: ${restaurant.name}, Address: ${restaurant.address}, Rating: ${restaurant.rating}`;
                    restaurantList.appendChild(div);
                });
            })
            .catch(error => console.error('Error:', error));
    </script>
</body>
</html>
위 과정을 통해 MariaDB에서 데이터를 조회하여 프론트엔드에 표시할 수 있습니다. 이 기본적인 예제를 바탕으로, 필요에 따라 확장하고 개선할 수 있습니다.
