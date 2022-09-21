//FROM: https://reasonabledeviations.com/2019/10/02/k-means-in-cpp/
#include <ctime>     // for a random seed
#include <fstream>   // for file-reading
#include <iostream>  // for file-reading
#include <sstream>   // for file-reading
#include <vector>
#include <set>
#include <string>

using namespace std;

struct Point {
    double x, y;     // coordinates
    int cluster;     // no default cluster
    double minDist;  // default infinite dist to nearest cluster

    Point() : 
        x(0.0), 
        y(0.0),
        cluster(-1),
        minDist(__DBL_MAX__) {}
        
    Point(double x, double y) : 
        x(x), 
        y(y),
        cluster(-1),
        minDist(__DBL_MAX__) {}

    double distance(Point p) {
        return (p.x - x) * (p.x - x) + (p.y - y) * (p.y - y);
    }
};

vector<Point> readcsv(char** filename) {
    vector<Point> points;
    string line;
    ifstream file(*filename);

    while (getline(file, line)) {
        stringstream lineStream(line);
        string bit;
        double x, y;
        getline(lineStream, bit, '\t');
        x = stof(bit);
        getline(lineStream, bit, '\n');
        y = stof(bit);

        points.push_back(Point(x, y));
    }
    return points;
}

// Makae this functions
void kMeansClustering(vector<Point>* points, int epochs, int k, int totalNodes)
{
    int n = totalNodes;
    vector<Point> centroids;
    vector<int> nPoints;
    vector<double> sumX, sumY;

    // Initialise with zeroes -- These are the new centroids
    for (int j = 0; j < k; ++j) {
        nPoints.push_back(0);
        sumX.push_back(0.0);
        sumY.push_back(0.0);
    }

    //This is picking a random node to be a cluster centre
    srand(time(0));  // need to set the random seed
    std::set<int> numbers;
    while (numbers.size() < k)
    {
        numbers.insert(rand() % n);
    }

    for(auto f : numbers) {
        centroids.push_back(points->at(f));
    }

    for (vector<Point>::iterator c = begin(centroids); 
    c != end(centroids); ++c) {
        // quick hack to get cluster index
        int clusterId = c - begin(centroids);

        for (vector<Point>::iterator it = points->begin();
            it != points->end(); ++it) {
                
            Point p = *it;
            double dist = c->distance(p);
            if (dist < p.minDist) {
                p.minDist = dist;
                p.cluster = clusterId;
            }
            *it = p;
        }
    }

    // Iterate over points to append data to centroids
    for (vector<Point>::iterator it = points->begin(); 
        it != points->end(); ++it) {
        int clusterId = it->cluster;
        nPoints[clusterId] += 1;
        sumX[clusterId] += it->x;
        sumY[clusterId] += it->y;

        it->minDist = __DBL_MAX__;  // reset distance
    }

    // Compute the new centroids
    for (vector<Point>::iterator c = begin(centroids); 
        c != end(centroids); ++c) {
        int clusterId = c - begin(centroids);
        c->x = sumX[clusterId] / nPoints[clusterId];
        c->y = sumY[clusterId] / nPoints[clusterId];
    }


    ofstream myfile;
    myfile.open("output.csv");
    // For troubleshootting the below can be uncommented and will show the centroid nodes
    // from the kMeansClustering 
    // myfile << "x,y,c" << endl;

    // for (vector<Point>::iterator itss = begin(centroids); 
    //     itss != end(centroids); ++itss) {
    //     myfile << itss->x << "," << itss->y << endl;
    // }
    
    for (vector<Point>::iterator it = points->begin(); 
        it != points->end(); ++it) {
        myfile << it->x << "," << it->y << "," << it->cluster << endl;
    }
    myfile.close();
}

int main(int argc, char** argv) {
    int totalNodes = 200;
    int k = 12;
    if (argc > 2)   
    {
        totalNodes = stoi(argv[3]);
        k = stoi(argv[2]);
    }

    int epochs = 100; //argv[3]
    vector<Point> points = readcsv(&argv[1]); 
    kMeansClustering(&points, epochs, k, totalNodes);
    return 0;
}
