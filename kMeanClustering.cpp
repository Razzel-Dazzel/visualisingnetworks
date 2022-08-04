// #include <ctime>     // for a random seed
// #include <fstream>   // for file-reading
// #include <iostream>  // for file-reading
// #include <sstream>   // for file-reading
// #include <vector>

// using namespace std;
// vector<Point> points = readcsv();

// struct Point {
//     double x, y;     // coordinates
//     int cluster;     // no default cluster
//     double minDist;  // default infinite dist to nearest cluster

//     Point() : 
//         x(0.0), 
//         y(0.0),
//         cluster(-1),
//         minDist(__DBL_MAX__) {}
        
//     Point(double x, double y) : 
//         x(x), 
//         y(y),
//         cluster(-1),
//         minDist(__DBL_MAX__) {}

//     double distance(Point p) {
//         return (p.x - x) * (p.x - x) + (p.y - y) * (p.y - y);
//     }
// };

// vector<Point> readcsv() {
//     vector<Point> points;
//     string line;
//     ifstream file("Rmynewfile.txt");

//     while (getline(file, line)) {
//         stringstream lineStream(line);
//         string bit;
//         double x, y;
//         getline(lineStream, bit, '\t');
//         x = stof(bit);
//         getline(lineStream, bit, '\n');
//         y = stof(bit);

//         points.push_back(Point(x, y));
//     }
//     return points;
// }

// // Makae this functions
// void kMeansClustering(vector<Point>* points, int epochs, int k);

// int main(){
//     int k;
//     int n;
//     vector<Point> centroids;
//     srand(time(0));  // need to set the random seed

//     //Initialising the clusters
//     for (int i = 0; i < k; ++i) {
//         centroids.push_back(points.at(rand() % n));
//     }

//     // Assigning points to a cluster
//     for (vector<Point>::iterator c = begin(centroids); 
//      c != end(centroids); ++c) {
//     // quick hack to get cluster index
//     int clusterId = c - begin(centroids);

//         for (vector<Point>::iterator it = points->begin();
//             it != points->end(); ++it) {
                
//             Point p = *it;
//             double dist = c->distance(p);
//             if (dist < p.minDist) {
//                 p.minDist = dist;
//                 p.cluster = clusterId;
//             }
//             *it = p;
//         }

//         vector<int> nPoints;
//         vector<double> sumX, sumY;

//         // Initialise with zeroes
//         for (int j = 0; j < k; ++j) {
//             nPoints.push_back(0);
//             sumX.push_back(0.0);
//             sumY.push_back(0.0);
//         }
//     }   
// }



// // // Define new point at the origin
// // Point p1 = Point(0.0, 0.0);
// // cout << p1.x << endl;  // print the x coordinate

// // // Define another point and compute square distance
// // Point p2 = Point(3.0, 4.0);
// // cout << p1.distance(p2) << endl;  // prints 25.0